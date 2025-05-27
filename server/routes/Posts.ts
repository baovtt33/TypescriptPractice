import { Request, Response } from 'express';
const express = require("express");
const router = express.Router();
const { Posts, Likes } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");
import { AuthenticatedRequest } from '../middlewares/AuthMiddleware';
import { likeType } from './Likes'

type postType = {
  id: number
  title: string,
  postText: string,
  username: string,
  UserId: number,
  Likes: likeType[]
}

router.get("/", validateToken, async (req: AuthenticatedRequest, res: Response) => {
  const listOfPosts : postType[] = await Posts.findAll({ include: [Likes] });
  const likedPosts : likeType[] = await Likes.findAll({ where: { UserId: req.user.id } });
  res.json({ listOfPosts: listOfPosts, likedPosts: likedPosts });
  // res.json(listOfPosts);
});

router.get("/byId/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const post : postType = await Posts.findByPk(id);
  res.json(post);
});

router.get("/byuserId/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const listOfPosts : postType[] = await Posts.findAll({
    where: { UserId: id },
    include: [Likes],
  });
  res.json(listOfPosts);
});

router.post("/", validateToken, async (req: AuthenticatedRequest, res: Response) => {
  const post : postType = req.body;
  post.username = req.user.username;
  post.UserId = req.user.id;
  await Posts.create(post);
  res.json(post);
});

router.put("/title", validateToken, async (req: Request, res: Response) => {
  // const { newTitle, id } = req.body;
  const newTitle : string = req.body.newTitle;
  const id : number = req.body.id;
  await Posts.update({ title: newTitle }, { where: { id: id } });
  res.json(newTitle);
});

router.put("/postText", validateToken, async (req: Request, res: Response) => {
  // const { newText, id } = req.body;
  const newText : string = req.body.newText;
  const id : number = req.body.id;
  await Posts.update({ postText: newText }, { where: { id: id } });
  res.json(newText);
});

router.delete("/:postId", validateToken, async (req: Request, res: Response) => {
  const postId = Number(req.params.postId);
  await Posts.destroy({
    where: {
      id: postId,
    },
  });

  res.json("DELETED SUCCESSFULLY");
});

module.exports = router;