import { Request, Response, NextFunction } from "express";

type TokenPayload = {
  _id: string;
};
import User from "../models/user_model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { Token } from "typescript";

function sendError(res: Response, msg: string) {
  res.status(400).send({
    status: "fail",
    massage: msg,
  });
}

const register = async (req: Request, res: Response) => {
  console.log("Register function called");

  const { userName, email, password } = req.body;

  if (!email || !password) {
    return sendError(res, "email and password are required");
  }

  try {
    const user = await User.findOne({ email: email });
    if (user != null) {
      return sendError(res, "user already exists");
    }
  } catch (err) {
    return sendError(res, "error in finding user");
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);
    const user = new User({
      userName: userName,
      email: email,
      password: encryptedPassword,
    });
    const newUser = await user.save();
    res.status(200).send(newUser);
  } catch (err) {
    return sendError(res, "failed registering user");
  }
};

const generateTokens = (
  _id: string
): {
  accessToken: string;
  refreshToken: string;
} | null => {
  const random = Math.floor(Math.random() * 1000000);
  if (!process.env.TOKEN_SECRET) {
    return null;
  }
  const accessToken = jwt.sign(
    {
      _id: _id,
      random: random,
    },
    process.env.TOKEN_SECRET,
    { expiresIn: process.env.TOKEN_EXPIRATION }
  );

  const refreshToken = jwt.sign(
    {
      _id: _id,
      random: random,
    },
    process.env.TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION }
  );

  return { accessToken, refreshToken };
};

const login = async (req: Request, res: Response) => {
  console.log("Login function called");
  const { userName, email, password } = req.body;

  if (!email || !password) {
    return sendError(res, "email or password are worng");
  }

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return sendError(res, "email or password are worng");
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return sendError(res, "email or password are worng");
    }

    const userId: string = user._id.toString();
    const tokens = generateTokens(userId);
    if (!tokens) {
      res.status(400).send("missing auth configuration");
      return;
    }

    if (user.refreshTokens == null) {
      user.refreshTokens = [];
    }
    user.refreshTokens.push(tokens.refreshToken);
    await user.save();
    res.status(200).send({
      userName: user.userName,
      email: user.email,
      _id: user._id,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  } catch (err) {
    res.status(400);
  }
};

const logout = async (req: Request, res: Response) => {
  console.log("Logout function called");
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) {
    res.status(400).send("missing refresh token");
    return;
  }

  if (!process.env.TOKEN_SECRET) {
    res.status(400).send("missing auth configuration");
    return;
  }

  jwt.verify(
    refreshToken,
    process.env.TOKEN_SECRET,
    async (err: any, data: any) => {
      if (err) {
        res.status(403).send("invalid token");
        return;
      }

      const payload = data as TokenPayload;
      try {
        const user = await User.findById({ _id: payload._id });
        if (!user) {
          res.status(400).send("user not found");
          return;
        }
        if (!user.refreshTokens || !user.refreshTokens.includes(refreshToken)) {
          res.status(400).send("invalid refresh token");
          user.refreshTokens = [];
          await user.save();
          return;
        }
        const tokens = user.refreshTokens.filter(
          (token) => token !== refreshToken
        );
        user.refreshTokens = tokens;
        await user.save();
        res.status(200).send("logged out");
      } catch (err) {
        res.status(400).send("invalid token");
      }
    }
  );
};

const refresh = async (req: Request, res: Response) => {
  //first validate the refresh token
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) {
    res.status(400).send("invalid token");
    return;
  }
  if (!process.env.TOKEN_SECRET) {
    res.status(400).send("missing auth configuration");
    return;
  }
  jwt.verify(
    refreshToken,
    process.env.TOKEN_SECRET,
    async (err: any, data: any) => {
      if (err) {
        res.status(403).send("invalid token");
        return;
      }
      //find the user
      const payload = data as TokenPayload;
      try {
        const user = await User.findOne({ _id: payload._id });
        if (!user) {
          res.status(400).send("invalid token");
          return;
        }
        //check that the token exists in the user
        if (!user.refreshTokens || !user.refreshTokens.includes(refreshToken)) {
          user.refreshTokens = [];
          await user.save();
          res.status(400).send("invalid token");
          return;
        }
        //generate a new access token
        const newTokens = generateTokens(user._id.toString());
        if (!newTokens) {
          user.refreshTokens = [];
          await user.save();
          res.status(400).send("missing auth configuration");
          return;
        }

        //delete the old refresh token
        user.refreshTokens = user.refreshTokens.filter(
          (token) => token !== refreshToken
        );
        //save the new refresh token in the user
        user.refreshTokens.push(newTokens.refreshToken);
        await user.save();

        //return the new access token and the new refresh token
        res.status(200).send({
          accessToken: newTokens.accessToken,
          refreshToken: newTokens.refreshToken,
        });
      } catch (err) {
        res.status(400).send("invalid token");
      }
    }
  );
};

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    res.status(401).send("missing token");
    return;
  }
  if (!process.env.TOKEN_SECRET) {
    res.status(500).send("missing auth configuration");
    return;
  }
  jwt.verify(token, process.env.TOKEN_SECRET, (err, data) => {
    if (err) {
      res.status(403).send("invalid token");
      return;
    }
    const payload = data as TokenPayload;
    req.query.userId = payload._id;
    next();
  });
};

export default {
  refresh,
  login,
  register,
  logout,
};
