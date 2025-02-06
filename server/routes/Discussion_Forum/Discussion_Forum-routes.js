const express = require("express");
const router = express.Router();
const forumController = require("../../controllers/Discussion_Forum/Discussion_Forum-controller");
const authMiddleware = require("../../middleware/auth-middleware");


router.post("/post", authMiddleware, forumController.createForumPost);

router.get("/:courseId", authMiddleware, forumController.getForumPostsByCourse);

router.post("/:postId/reply", authMiddleware, forumController.addReplyToPost);

router.post("/:postId/vote", authMiddleware, forumController.votePost); // during direct vote transfer from upvote to downvote and vice-versa the previous votes isn't getting decremented.

module.exports = router;
