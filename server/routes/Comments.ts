import { Request, Response } from 'express';
const express = require("express");
const router = express.Router();
const { Comments } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");
import { AuthenticatedRequest } from '../middlewares/AuthMiddleware';

type commentType = {
  id: number
  commentBody: string,
  username: string,
  PostId: number,
}

router.get("/:postId", async (req: Request, res: Response) => {
  const postId = req.params.postId;
  const comments : commentType = await Comments.findAll({ where: { PostId: postId } });
  res.json(comments);
});

router.post("/", validateToken, async (req: AuthenticatedRequest, res: Response) => {
  const comment : commentType = req.body;
  comment.username = req.user.username;
  await Comments.create(comment);
  res.json(comment);
});

router.delete("/:commentId", validateToken, async (req: Request, res: Response) => {
  const commentId = req.params.commentId;

  await Comments.destroy({
    where: {
      id: commentId,
    },
  });

  res.json("DELETED SUCCESSFULLY");
});

module.exports = router;