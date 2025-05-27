import { Request, Response, NextFunction } from 'express';
const { verify } = require("jsonwebtoken");

export interface AuthenticatedRequest extends Request {
  user: {
    username: string,
    id: number
  };
}

type validTokenType = {
  username: string,
  id: number
}

const validateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const accessToken = req.header("accessToken");

  if (!accessToken) return res.json({ error: "User not logged in!" });

  try {
    const validToken : validTokenType = verify(accessToken, "importantsecret");
    req.user = validToken;

    if (validToken) {
      return next();
    }
  } catch (err) {
    return res.json({ error: err });
  }
};

module.exports = { validateToken };