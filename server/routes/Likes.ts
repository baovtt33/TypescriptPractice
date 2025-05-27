import { Request, Response } from 'express';
const express = require("express");
const router = express.Router();
const { Likes } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");
import { AuthenticatedRequest } from '../middlewares/AuthMiddleware';

export type likeType = {
  id: number,
  PostId: number,
  UserId: number
}

router.post("/", validateToken, async (req: AuthenticatedRequest, res: Response) => {
  // const { PostId } = req.body;
  const PostId : number = req.body.PostId;
  const UserId : number = req.user.id;

  const found : likeType = await Likes.findOne({
    where: { PostId: PostId, UserId: UserId },
  });
  if (!found) {
    await Likes.create({ PostId: PostId, UserId: UserId });
    res.json({ liked: true });
  } else {
    await Likes.destroy({
      where: { PostId: found.PostId, UserId: found.UserId },
    });
    res.json({ liked: false });
  }
});

module.exports = router;