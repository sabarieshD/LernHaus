// client/src/components/Discussion/ForumPage.jsx
import { useState, useEffect, useContext } from "react";
import { Button, Input, Textarea } from "@/components/ui";
import { AuthContext } from "@/context/auth-context";
import { CreatePostForm } from "../../../components/Discussion/CreatePostForm.jsx"; 
import { PostItem } from "../../../components/Discussion/PostItem"; 
import { PostList } from "../../../components/Discussion/PostList.jsx"; 
import { ReplyForm } from "../../../components/Discussion/ReplyForm.jsx"; 
import { VoteButtons } from "@/components/Discussion/VoteButtons"; 

function ForumPage() {
  const { auth } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [replies, setReplies] = useState({});
  const [isPosting, setIsPosting] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [error, setError] = useState("");

  // Fetch posts from the server
  const fetchPosts = async () => {
    setIsPosting(true);
    try {
      const response = await getPostsService();
      if (response?.success) {
        setPosts(response?.data);
      } else {
        setError("Failed to load posts.");
      }
    } catch (err) {
      setError("An error occurred while fetching posts.");
    } finally {
      setIsPosting(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Handle creating a new post
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      setError("Please fill in both title and content.");
      return;
    }

    setIsPosting(true);
    try {
      const response = await CreatePostForm(auth?.user?._id, title, content);
      if (response?.success) {
        setPosts([response?.data, ...posts]);
        setTitle("");
        setContent("");
      } else {
        setError("Failed to create post.");
      }
    } catch (err) {
      setError("An error occurred while creating the post.");
    } finally {
      setIsPosting(false);
    }
  };

  // Handle replying to a post
  const handleReplySubmit = async (postId, e) => {
    e.preventDefault();
    const replyContent = replies[postId];
    if (!replyContent) {
      setError("Please write a reply.");
      return;
    }

    setIsReplying(true);
    try {
      const response = await replyToPostService(postId, replyContent);
      if (response?.success) {
        setPosts(posts.map(post => 
          post._id === postId ? { ...post, replies: [...post.replies, response?.data] } : post
        ));
        setReplies((prev) => ({ ...prev, [postId]: "" }));
      } else {
        setError("Failed to submit reply.");
      }
    } catch (err) {
      setError("An error occurred while submitting your reply.");
    } finally {
      setIsReplying(false);
    }
  };

  // Handle upvoting and downvoting a post
  const handleVote = async (postId, type) => {
    try {
      const response = await voteOnPostService(postId, type);
      if (response?.success) {
        setPosts(posts.map(post => 
          post._id === postId ? { ...post, [type]: post[type] + 1 } : post
        ));
      }
    } catch (err) {
      console.error("Error voting on post:", err);
    }
  };

  return (
    <div className="p-4 bg-[#1c1d1f]">
      <h2 className="text-2xl font-bold mb-4">Forum</h2>
      {error && <p className="text-red-500">{error}</p>}

      {/* Create Post Form */}
      <div className="bg-[#2c2f36] p-4 rounded-lg mb-6">
        <h3 className="text-xl font-bold text-white mb-4">Create a New Post</h3>
        <form onSubmit={handleCreatePost}>
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Post Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-[#2c2f36] text-white"
            />
            <Textarea
              placeholder="Post Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="bg-[#2c2f36] text-white"
            />
            <Button type="submit" disabled={isPosting} className="w-full">
              {isPosting ? "Posting..." : "Create Post"}
            </Button>
          </div>
        </form>
      </div>

      {/* Display Posts */}
      {isPosting ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post._id} className="bg-[#2c2f36] p-4 rounded-lg space-y-2">
              <h3 className="text-xl font-semibold text-white">{post.title}</h3>
              <p className="text-sm text-gray-400">{new Date(post.createdAt).toLocaleString()}</p>
              <p className="text-white">{post.content}</p>

              {/* Vote Buttons */}
              <div className="space-x-4">
                <Button onClick={() => handleVote(post._id, "upvotes")} className="text-green-500">
                  👍 {post.upvotes}
                </Button>
                <Button onClick={() => handleVote(post._id, "downvotes")} className="text-red-500">
                  👎 {post.downvotes}
                </Button>
              </div>

              {/* Reply Form */}
              <div className="mt-4">
                <form onSubmit={(e) => handleReplySubmit(post._id, e)}>
                  <Textarea
                    placeholder="Write a reply..."
                    value={replies[post._id] || ""}
                    onChange={(e) => setReplies({ ...replies, [post._id]: e.target.value })}
                    rows={4}
                    className="bg-[#2c2f36] text-white"
                  />
                  <Button type="submit" disabled={isReplying} className="w-full mt-2">
                    {isReplying ? "Posting Reply..." : "Post Reply"}
                  </Button>
                </form>
              </div>

              {/* Display Replies */}
              <div className="mt-4">
                {post.replies?.map((reply, idx) => (
                  <div key={idx} className="bg-[#333] p-3 rounded-lg mb-3">
                    <p className="text-white">{reply.content}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ForumPage;
