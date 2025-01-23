import request from "supertest";
import { initApp } from "../server";
import mongoose from "mongoose";
import userModel from "../models/user_model";
import { Express } from "express";

let app: Express;

const userInfo: { email: string; password: string; userName: string; token?: string; _id?: string } = {
  email: "yuval@gmail.com",
  password: "123456",
  userName: "yuvalavi",
};

const testUser = {
  email: "testuser@gmail.com",
  password: "password123",
  userName: "testuser",
};

const updatedUser = {
  email: "updateduser@gmail.com",
  password: "newpassword123",
  userName: "updateduser",
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
  await userModel.deleteMany();
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe("User Controller Tests", () => {
  it("Create User test", async () => {
    const response = await request(app)
      .post("/users")
      .set("authorization", "JWT " + userInfo.token)
      .send(testUser);

    const createdUser = response.body;
    expect(response.statusCode).toBe(201);
    expect(createdUser.email).toBe(testUser.email);
    expect(createdUser.userName).toBe(testUser.userName);
  });

  it("Get All Users test", async () => {
    await request(app)
      .post("/users")
      .set("authorization", "JWT " + userInfo.token)
      .send(testUser);

    const response = await request(app)
      .get("/users")
      .set("authorization", "JWT " + userInfo.token);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("Get User by ID test", async () => {
    const { body: createdUser } = await request(app)
      .post("/users")
      .set("authorization", "JWT " + userInfo.token)
      .send(testUser);

    const response = await request(app)
      .get("/users/" + createdUser._id)
      .set("authorization", "JWT " + userInfo.token);

    const user = response.body;
    expect(response.statusCode).toBe(200);
    expect(user._id).toBe(createdUser._id);
  });

  it("Get User by ID test fail (user not found)", async () => {
    const nonExistentUserId = "60d5f3d6f8a4c40028b3f52e"; // Random ID or invalid one

    const response = await request(app)
      .get("/users/" + nonExistentUserId)
      .set("authorization", "JWT " + userInfo.token);

    expect(response.statusCode).toBe(404);
  });

  it("Update User test", async () => {
    const { body: createdUser } = await request(app)
      .post("/users")
      .set("authorization", "JWT " + userInfo.token)
      .send(testUser);

    const response = await request(app)
      .put("/users/" + createdUser._id)
      .set("authorization", "JWT " + userInfo.token)
      .send(updatedUser);

    const updatedUserResponse = response.body;
    expect(response.statusCode).toBe(200);
    expect(updatedUserResponse.email).toBe(updatedUser.email);
    expect(updatedUserResponse.userName).toBe(updatedUser.userName);
  });

  it("Update User test fail (user not found)", async () => {
    const nonExistentUserId = "60d5f3d6f8a4c40028b3f52e"; // Random ID or invalid one

    const response = await request(app)
      .put("/users/" + nonExistentUserId)
      .set("authorization", "JWT " + userInfo.token)
      .send(updatedUser);

    expect(response.statusCode).toBe(404);
  });

  it("Delete User test", async () => {
    const { body: createdUser } = await request(app)
      .post("/users")
      .set("authorization", "JWT " + userInfo.token)
      .send(testUser);

    const response = await request(app)
      .delete("/users/" + createdUser._id)
      .set("authorization", "JWT " + userInfo.token);

    expect(response.statusCode).toBe(204);

    const respponse2 = await request(app)
      .get("/users/" + createdUser._id)
      .set("authorization", "JWT " + userInfo.token);
    expect(respponse2.statusCode).toBe(404);
  });

  it("Delete User test fail (user not found)", async () => {
    const nonExistentUserId = "60d5f3d6f8a4c40028b3f52e"; // Random ID or invalid one

    const response = await request(app)
      .delete("/users/" + nonExistentUserId)
      .set("authorization", "JWT " + userInfo.token);

    expect(response.statusCode).toBe(404);
  });
});
