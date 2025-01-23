import request from "supertest";
import { initApp } from "../server";
import mongoose from "mongoose";
import { Express } from "express";
import userModel from "../models/user_model";
import postsModel from "../models/post_model";

let app: Express;

type UserInfo = {
  userName: string;
  email: string;
  password: string;
  accessToken?: string;
  refreshToken?: string;
  _id?: string;
};
const userInfo: UserInfo = {
  userName: "Eliav",
  email: "eliav@gmail.com",
  password: "123456",
};

beforeAll(async () => {
  app = await initApp();
  await userModel.deleteMany();
  await postsModel.deleteMany();
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe("Auth Tests", () => {
  it("Auth Registration", async () => {
    const response = await request(app).post("/auth/register").send(userInfo);
    expect(response.statusCode).toBe(200);
  });

  it("Auth Registration fail - user already exists", async () => {
    const response = await request(app).post("/auth/register").send(userInfo);
    expect(response.statusCode).toBe(400);
    expect(response.body.massage).toBe("user already exists");
  });

  it("Auth Registration fail - missing email or password", async () => {
    const response = await request(app).post("/auth/register").send({
      userName: userInfo.userName,
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.massage).toBe("email and password are required");
  });

  it("Auth Login", async () => {
    const response = await request(app).post("/auth/login").send(userInfo);
    expect(response.statusCode).toBe(200);
    const { accessToken, refreshToken, _id } = response.body;
    expect(accessToken).toBeDefined();
    expect(refreshToken).toBeDefined();
    expect(_id).toBeDefined();
    userInfo.accessToken = accessToken;
    userInfo.refreshToken = refreshToken;
    userInfo._id = _id;
  });

  it("Auth Login fail - invalid email or password", async () => {
    const response = await request(app).post("/auth/login").send({
      email: "invalid@gmail.com",
      password: "wrongpassword",
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.massage).toBe("email or password are worng");
  });

  it("Auth Login fail - missing email or password", async () => {
    const response = await request(app).post("/auth/login").send({
      email: userInfo.email,
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.massage).toBe("email or password are worng");
  });

  it("Make sure two access tokens are not the same", async () => {
    const response = await request(app).post("/auth/login").send({
      email: userInfo.email,
      password: userInfo.password,
    });
    expect(response.body.accessToken).not.toEqual(userInfo.accessToken);
  });

  it("Get protected API", async () => {
    const response = await request(app).post("/posts").send({
      sender: "",
      title: "My First post",
      content: "This is my first post",
    });
    expect(response.statusCode).toBe(401); // Unauthorized
    const response2 = await request(app)
      .post("/posts")
      .set({
        authorization: "JWT " + userInfo.accessToken,
      })
      .send({
        sender: "invalid owner",
        title: "My Second post",
        content: "This is my second post",
      });
    expect(response2.statusCode).toBe(201);
  });

  it("Get protected API invalid token", async () => {
    const response = await request(app)
      .post("/posts")
      .set({ authorization: "JWT " + userInfo.accessToken + "1" }) // invalid token
      .send({
        sender: userInfo._id,
        title: "My First post",
        content: "This is my first post",
      });
    expect(response.statusCode).not.toBe(201);
  });

  it("Refresh Token", async () => {
    const response = await request(app).post("/auth/refresh").send({
      refreshToken: userInfo.refreshToken,
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.refreshToken).toBeDefined();
    userInfo.accessToken = response.body.accessToken;
    userInfo.refreshToken = response.body.refreshToken;
  });

  it("Refresh Token fail - missing refresh token", async () => {
    const response = await request(app).post("/auth/refresh").send({});
    expect(response.statusCode).toBe(400);
    expect(response.body).toBe("invalid token");
  });

  it("Logout - invalidate refresh token", async () => {
    const response = await request(app).post("/auth/logout").send({
      refreshToken: userInfo.refreshToken,
    });
    expect(response.statusCode).toBe(200);

    const response2 = await request(app).post("/auth/refresh").send({
      refreshToken: userInfo.refreshToken,
    });
    expect(response2.statusCode).not.toBe(200);
  });

  it("Logout fail - missing refresh token", async () => {
    const response = await request(app).post("/auth/logout").send({});
    expect(response.statusCode).toBe(400);
    expect(response.body).toBe("missing refresh token");
  });

  jest.setTimeout(30000);

  it("Refresh token multiple usage", async () => {
    //login - get a refresh token
    const response = await request(app).post("/auth/login").send({
      email: userInfo.email,
      password: userInfo.password,
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.refreshToken).toBeDefined();
    userInfo.accessToken = response.body.accessToken;
    userInfo.refreshToken = response.body.refreshToken;

    //first time use the refresh token and get a new one
    const response2 = await request(app).post("/auth/refresh").send({
      refreshToken: userInfo.refreshToken,
    });
    expect(response2.statusCode).toBe(200);
    const newRefreshToken = response2.body.refreshToken;

    //second time use the old refresh token and expect to fail
    const response3 = await request(app).post("/auth/refresh").send({
      refreshToken: userInfo.refreshToken,
    });
    expect(response3.statusCode).not.toBe(200);

    //try to use the new refresh token and expect to fail
    const response4 = await request(app).post("/auth/refresh").send({
      refreshToken: newRefreshToken,
    });
    expect(response4.statusCode).not.toBe(200);
  });
});