import request from "supertest";
import { initApp } from "../server";
import mongoose from "mongoose";
import commentsModel from "../models/comments_model";
import postsModel from "../models/post_model";
import { Express } from "express";
import { readFile } from "fs/promises";
import Comment from "../models/comments_model";

var app: Express;

const userInfo = {
  email: "yuval@gmail.com",
  password: "123456",
  userName: "yuvalavi",
  _id: "",
  token: "",
};

const testPost1 = {
  title: "My First post",
  content: "This is my first post",
  sender: "yuvalavi",
};

let testComment = {
  content: "This is a comment",
  author: "yuvalavi",
  postId: "",
  _id: undefined,
};

describe("Comments Tests", () => {
  beforeAll(async () => {
    app = await initApp();
    await postsModel.deleteMany();
    await commentsModel.deleteMany();
    await request(app).post("/auth/register").send(userInfo);
    const response = await request(app).post("/auth/login").send(userInfo);
    userInfo.token = response.body.accessToken;
    userInfo._id = response.body._id;
    testComment.postId = (await postsModel.create(testPost1))._id.toString();
  });

  afterAll((done) => {
    mongoose.connection.close();
    done();
  });

  test("Comments test get all", async () => {
    const response = await request(app)
      .get("/comments")
      .set("authorization", "JWT " + userInfo.token);
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(0);
  });

  test("Test Create Comment", async () => {
    const response = await request(app)
      .post("/comments")
      .set("authorization", "JWT " + userInfo.token)
      .send(testComment);
    console.log(response);
    expect(response.statusCode).toBe(201);
    expect(response.body.content).toBe(testComment.content);
    expect(response.body.postId).toBe(testComment.postId);
    expect(response.body.author).toBe(testComment.author);
    testComment._id = response.body._id;
  });

  test("Test get comments ", async () => {
    const response = await request(app)
      .get("/comments")
      .set("authorization", "JWT " + userInfo.token);
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].content).toBe(testComment.content);
    expect(response.body[0].postId).toBe(testComment.postId);
    expect(response.body[0].author).toBe(testComment.author);
  });

  test("Comments get comment by post id", async () => {
    const response = await request(app)
      .get("/comments/" + testComment.postId)
      .set("authorization", "JWT " + userInfo.token);
    expect(response.statusCode).toBe(200);
    expect(response.body[0].content).toBe(testComment.content);
    expect(response.body[0].postId).toBe(testComment.postId);
    expect(response.body[0].author).toBe(testComment.author);
  });

  test("Update comment by id", async () => {
    await request(app)
      .put("/comments/" + testComment._id)
      .set("authorization", "JWT " + userInfo.token)
      .send({ content: "updated comment" });

    const response = await request(app)
      .get("/comments")
      .set("authorization", "JWT " + userInfo.token);
    expect(response.statusCode).toBe(200);
    expect(response.body[0].content).toBe("updated comment");
  });

  test("Delete comment by id", async () => {
    const response = await request(app)
      .delete("/comments/" + testComment._id)
      .set("authorization", "JWT " + userInfo.token);
    expect(response.statusCode).toBe(204);

    const response2 = await request(app)
      .get("/comments")
      .set("authorization", "JWT " + userInfo.token);
    expect(response2.statusCode).toBe(200);
    expect(response2.body.length).toBe(0);
  });
});
