import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import posts_routes from "./routes/posts_routes";
import comments_routes from "./routes/comments_routes";

export const initApp = async () => {
  const app = express();

  mongoose.connection.on(
    "error",
    console.error.bind(console, "connection error:")
  );
  mongoose.connection.on("open", function () {
    console.log("connected to the database");
  });

  await mongoose.connect(process.env.DB_CONNECT ?? "127.0.0.1:27017");

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use("/posts", posts_routes);
  app.use("/comments", comments_routes);

  return app;
};
