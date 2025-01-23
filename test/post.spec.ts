import request from "supertest";
import { initApp } from "../server";
import mongoose from "mongoose";
import postsModel from "../models/post_model";
import { Express } from "express";
import userModel from "../models/user_model";

let app: Express;

type UserInfo = {
  email: string;
  password: string;
  userName: string;
  token?: string;
  _id?: string;
};

const userInfo: UserInfo = {
  email: "yuval@gmail.com",
  password: "123456",
  userName: "yuvalavi",
};

const testPost1 = {
  title: "My First post",
  content: "This is my first post",
};

const testPost2 = {
  title: "My First post 2",
  content: "This is my first post 2",
};

const testPostFail = {
  content: "This is my first post 2",
};

beforeAll(async () => {
  app = await initApp();
  await userModel.deleteMany();
  await request(app).post("/auth/register").send(userInfo);
  const response = await request(app).post("/auth/login").send(userInfo);
  userInfo.token = response.body.accessToken;
  userInfo._id = response.body._id;
});

beforeEach(async () => {
  await postsModel.deleteMany();
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe("Posts Tests", () => {
  it("Posts Create test", async () => {
    const response = await request(app)
      .post("/posts")
      .set("authorization", "JWT " + userInfo.token)
      .send(testPost1);
    const post = response.body;
    expect(response.statusCode).toBe(201);
    expect(post.sender).toBe(userInfo._id);
    expect(post.title).toBe(testPost1.title);
    expect(post.content).toBe(testPost1.content);
  });

  it("Posts Get All test", async () => {
    const response = await request(app)
      .get("/posts")
      .set("authorization", "JWT " + userInfo.token);
    expect(response.statusCode).toBe(200);
  });

  it("Posts Get By Id test", async () => {
    const { body: createdPost } = await request(app)
      .post("/posts")
      .set("authorization", "JWT " + userInfo.token)
      .send(testPost1);
    const response = await request(app)
      .get("/posts/" + createdPost._id)
      .set("authorization", "JWT " + userInfo.token);
    const post = response.body;
    expect(response.statusCode).toBe(200);
    expect(response.body._id).toBe(post._id);
  });

  it("Posts Get By Id test fail", async () => {
    const response = await request(app)
      .get("/posts/" + "8478" + "3")
      .set("authorization", "JWT " + userInfo.token);
    const post = response.body;
    expect(response.statusCode).toBe(400);
  });

  it("Posts Create test", async () => {
    const response = await request(app)
      .post("/posts")
      .set("authorization", "JWT " + userInfo.token)
      .send(testPost2);
    const post = response.body;
    expect(response.statusCode).toBe(201);
    expect(post.title).toBe(testPost2.title);
    expect(post.content).toBe(testPost2.content);
  });

  it("Posts Create test fail", async () => {
    const response = await request(app)
      .post("/posts")
      .set("authorization", "JWT " + userInfo.token)
      .send(testPostFail);
    expect(response.statusCode).not.toBe(201);
  });

  it("Posts get posts by sender", async () => {
    await request(app)
      .post("/posts")
      .set("authorization", "JWT " + userInfo.token)
      .send(testPost1);
    const response = await request(app)
      .get("/posts?sender=" + userInfo._id)
      .set("authorization", "JWT " + userInfo.token);
    const post = response.body[0];
    expect(response.statusCode).toBe(200);
    expect(post.sender).toBe(userInfo._id);
    expect(response.body.length).toBe(1);
  });

  it("Posts Delete test", async () => {
    const { body: createdPost } = await request(app)
      .post("/posts")
      .set("authorization", "JWT " + userInfo.token)
      .send(testPost1);

    const response = await request(app)
      .delete("/posts/" + createdPost._id)
      .set("authorization", "JWT " + userInfo.token);
    expect(response.statusCode).toBe(204);

    const respponse2 = await request(app)
      .get("/posts/" + createdPost._id)
      .set("authorization", "JWT " + userInfo.token);
    expect(respponse2.statusCode).toBe(404);
  });
});
