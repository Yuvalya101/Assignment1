import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import posts_routes from "./routes/posts_routes";
import comments_routes from "./routes/comments_routes";
import users_routes from "./routes/users_routes";
import auth_routes from "./routes/auth_routes";
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Web Dev 2025 REST API",
      version: "1.0.0",
      description: "REST server including authentication using JWT",
    },
    servers: [{ url: "http://localhost:3000" }],
  },
  apis: ["./routes/*.ts"],
};
const specs = swaggerJsDoc(options);

export const initApp = async () => {
  const app = express();
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

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
  app.use("/users", users_routes);
  app.use("/auth", auth_routes);

  return app;
};
