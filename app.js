require("dotenv").config();
const express = require("express");
const connectDB = require("./db/connect");
const authRouter = require("./routes/auth");

const app = express();
app.use(express.json());

app.use("/api/v1/auth", authRouter);

app.use((err, req, res, next) => {
  if (res.headerSent) {
    return next(err);
  }
  res.status(err.code || 500);
  res.json({ message: err.message || "An unknown occured!" });
});

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(process.env.PORT);
    console.log(
      `Connection DB successfully and Server is listening on port:${process.env.PORT}`
    );
  } catch (error) {
    console.log(error);
  }
};
start();
