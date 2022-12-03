const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./router/userRouter");
require("dotenv").config();


const app = express();
app.use(express.json());


app.use('/api', userRouter);

mongoose
  .connect(process.env.MONGO_DB, () => {
    console.log("Mongo connected successfully");
  })
  .catch(() => {
    console.log("Connection error");
  });

app.listen(5000, () => {
  console.log("app listen port 5000 successfully");
});
