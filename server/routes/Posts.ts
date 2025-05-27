import { Request, Response } from 'express';
const express = require("express");
const router = express.Router();
const { Posts } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");
import { AuthenticatedRequest } from '../middlewares/AuthMiddleware';

type postType = {
  id: number
  title: string,
  postText: string,
  username: string,
  UserId: number,
}

router.get("/", async (req: Request, res: Response) => {
  const listOfPosts : postType[] = await Posts.findAll();
  res.json(listOfPosts);
});

router.get("/byId/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const post : postType = await Posts.findByPk(id);
  res.json(post);
});

router.post("/", async (req: Request, res: Response) => {
  const post : postType = req.body;
  await Posts.create(post);
  res.json(post);
});

module.exports = router;