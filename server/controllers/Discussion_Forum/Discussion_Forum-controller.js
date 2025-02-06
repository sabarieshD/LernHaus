const ForumPost = require("../../models/Discussion_Forum");

 const broadcastEvent = (io, event, data, room = null) => {
  if (room) {
    io.to(room).emit(event, data);  
  } else {
    io.emit(event, data);  
  }
};

 
exports.createForumPost = async (req, res) => {
  try {
    const { courseId, title, body } = req.body;
    const authorId = req.user.id;

    if (!title || !body) {
      return res.status(400).json({ message: "Title and body are required." });
    }

    const post = new ForumPost({ courseId, authorId, title, body });
    await post.save();

    broadcastEvent(req.io, "newPost", { post });

    res.status(201).json({ message: "Forum post created successfully.", post });
  } catch (error) {
    res.status(500).json({ message: "Failed to create forum post.", error: error.message });
  }
};

exports.getForumPostsByCourse = async (req, res) => {
    try {
      const { courseId } = req.params;
  
      if (!courseId) {
        return res.status(400).json({ message: "Course ID is required." });
      }
  
      const posts = await ForumPost.find({ courseId })
        .populate("authorId", "userName email") 
        .populate("replies.authorId", "userName email") 
        .sort({ createdAt: -1 }); 
  
      if (!posts || posts.length === 0) {
        return res.status(404).json({ message: "No forum posts found for this course." });
      }
  
      res.status(200).json({ message: "Forum posts fetched successfully.", posts });
    } catch (error) {
      console.error("Error fetching forum posts:", error);
  
      res.status(500).json({
        message: "Failed to fetch forum posts.",
        error: error.message,
      });
    }
  };


exports.addReplyToPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { body } = req.body;
    const authorId = req.user.id;

    if (!body) {
      return res.status(400).json({ message: "Reply content is required." });
    }

    const post = await ForumPost.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Forum post not found." });
    }

    post.replies.push({ authorId, body });
    await post.save();

    broadcastEvent(req.io, "newReply", { postId, reply: { authorId, body } });

    res.status(201).json({ message: "Reply added successfully.", post });
  } catch (error) {
    res.status(500).json({ message: "Failed to add reply.", error: error.message });
  }
};


exports.votePost = async (req, res) => {
    try {
      const { postId } = req.params;
      const { voteType } = req.body;
      const userId = req.user.id;
  
      const post = await ForumPost.findById(postId);
      if (!post) {
        return res.status(404).json({ message: "Forum post not found." });
      }
  
      let update = {}; 
  
      if (voteType === "upvote") {
        if (post.downvoteUsers.includes(userId)) {
          update = {
            $pull: { downvoteUsers: userId }, 
            $inc: { downvotes: -1 },
            $push: { upvoteUsers: userId }, 
            $inc: { upvotes: 1 }, 
          };
        } else if (post.upvoteUsers.includes(userId)) {
          update = {
            $pull: { upvoteUsers: userId }, 
            $inc: { upvotes: -1 }, 
          };
        } else {
          update = {
            $push: { upvoteUsers: userId }, 
            $inc: { upvotes: 1 }, 
          };
        }
      } else if (voteType === "downvote") {
        if (post.upvoteUsers.includes(userId)) {
          update = {
            $pull: { upvoteUsers: userId },
            $inc: { upvotes: -1 }, 
            $push: { downvoteUsers: userId }, 
            $inc: { downvotes: 1 }, 
          };
        } else if (post.downvoteUsers.includes(userId)) {
          update = {
            $pull: { downvoteUsers: userId }, 
            $inc: { downvotes: -1 }, 
          };
        } else {
          update = {
            $push: { downvoteUsers: userId }, 
            $inc: { downvotes: 1 }, 
          };
        }
      } else {
        return res.status(400).json({ message: "Invalid vote type." });
      }
  
      await ForumPost.findByIdAndUpdate(postId, update);
  
      const updatedPost = await ForumPost.findById(postId);
  
      broadcastEvent(req.io, "voteUpdate", { postId, upvotes: updatedPost.upvotes, downvotes: updatedPost.downvotes });
  
      res.status(200).json({ message: "Vote updated successfully.", post: updatedPost });
    } catch (error) {
      res.status(500).json({ message: "Failed to vote on the post.", error: error.message });
    }
  };
  
  
  
  
  
  