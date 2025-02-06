const mongoose = require("mongoose");

const forumPostSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String, 
      required: true,
    },
    body: {
      type: String, 
      required: true,
    },
    replies: [
      {
        authorId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User", 
          required: true,
        },
        body: {
          type: String, 
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    upvotes: {
      type: Number,
      default: 0, 
    },
    downvotes: {
      type: Number,
      default: 0, 
    },
    upvoteUsers: {
      type: [mongoose.Schema.Types.ObjectId], 
      ref: "User",
      default: [],
    },
    downvoteUsers: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ForumPost", forumPostSchema);
