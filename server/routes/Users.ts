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

type basicInfoType = {
  id: number,
  username: string,
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

router.get("/basicinfo/:id", async (req: Request, res: Response) => {
  const id = req.params.id;

  const basicInfo : basicInfoType = await Users.findByPk(id, {
    attributes: { exclude: ["password"] },
  });

  res.json(basicInfo);
});

router.put("/changepassword", validateToken, async (req: AuthenticatedRequest, res: Response) => {
  // const { oldPassword, newPassword } = req.body;
  const oldPassword : string = req.body.oldPassword;
  const newPassword : string = req.body.newPassword;
  const user = await Users.findOne({ where: { username: req.user.username } });

  bcrypt.compare(oldPassword, user.password).then(async (match : boolean) => {
    if (!match) res.json({ error: "Wrong Password Entered!" });

    bcrypt.hash(newPassword, 10).then((hash : string) => {
      Users.update(
        { password: hash },
        { where: { username: req.user.username } }
      );
      res.json("SUCCESS");
    });
  });
});

module.exports = router;