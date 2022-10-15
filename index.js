const compression = require("compression");
const serveStatic = require("serve-static");
const express = require("express");
const app = express();

const auth = require("./routes/auth");
const categories = require("./routes/categories");
const comments = require("./routes/comments");
const listings = require("./routes/listings");
const posts = require("./routes/posts");
const replies = require("./routes/replies");
const users = require("./routes/users");

app.use(express.json());
app.use(serveStatic("public", { acceptRanges: false }));
app.use(compression());
app.use("/api/auth", auth);
app.use("/api/categories", categories);
app.use("/api/comments", comments);
app.use("/api/listings", listings);
app.use("/api/posts", posts);
app.use("/api/replies", replies);
app.use("/api/users", users);

require("./startup/db")();
require("./startup/env")();

const port = process.env.PORT || 3000;
const server = app
  .listen(port, () => console.log(`Listening on port ${port}...`))
  .on("error", () => {
    process.once("SIGUSR2", () => process.kill(process.pid, "SIGUSR2"));
    process.once("SIGINT", () => process.kill(process.pid, "SIGINT"));
    process.once("uncaughtException", () => {});
  });

module.exports = server;
