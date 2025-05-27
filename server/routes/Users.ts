import { Request, Response } from 'express';
const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { validateToken } = require("../middlewares/AuthMiddleware");
import { AuthenticatedRequest } from '../middlewares/AuthMiddleware';

type userType = {
  id: number,
  username: string,
  password: string,
}

router.post("/", async (req: Request, res: Response) => {
  // const { username, password } = req.body;
  const username : string = req.body.username;
  const password: string = req.body.password;
  bcrypt.hash(password, 10).then((hash : string) => {
    Users.create({
      username: username,
      password: hash,
    });
    res.json("SUCCESS");
  });
});

router.post("/login", async (req: Request, res: Response) => {
  // const { username, password } = req.body;
  const username : string = req.body.username;
  const password: string = req.body.password;

  const user : userType = await Users.findOne({ where: { username: username } });

  if (!user) res.json({ error: "User Doesn't Exist" });

  bcrypt.compare(password, user.password).then((match : boolean) => {
    if (!match) res.json({ error: "Wrong Username And Password Combination" });

    const accessToken : string = sign(
      { username: user.username, id: user.id },
      "importantsecret"
    );
    res.json(accessToken);
  });
});

router.get("/auth", validateToken, (req: AuthenticatedRequest, res: Response) => {
  res.json(req.user);
});

module.exports = router;