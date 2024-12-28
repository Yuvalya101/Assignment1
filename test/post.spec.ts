import request from "supertest";
import { initApp } from "../server";
import { Express } from "express";
import mongoose, { mongo } from "mongoose";

let app: Express;

beforeAll(async () => {
  app = await initApp();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("GET /posts", () => {
  test("It should respond with an array of posts", async () => {
    const response = await request(app).get("/posts");
    expect(response.statusCode).toBe(200);
  });
});
