require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT;

const mongoose = require("mongoose");
mongoose.connect(process.env.DB_CONNECT);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("connected to the database");
});

const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const posts_routes = require("./routes/posts_routes");
app.use("/posts", posts_routes);

const comments_routes = require("./routes/comments_routes");
app.use("/comments", comments_routes);

app.listen(port, () => {
  console.log("Server started");
});
