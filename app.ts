import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import posts_routes from "./routes/posts_routes";

dotenv.config();

const app = express();
const port = process.env.PORT;

mongoose.connect(process.env.DB_CONNECT);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("connected to the database");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/posts", posts_routes);

app.listen(port, () => {
  console.log("Server started");
});
