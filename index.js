import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import postRouter from "./routes/postRoutes.js";
import userRouter from "./routes/userRoutes.js";
import dotenv from "dotenv";

const app = express();

dotenv.config();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use("/posts", postRouter);
app.use("/users", userRouter);

app.get("/", (req, res) => {
  res.send("APP IS RUNNING");
});

const PORT = process.env.PORT || 5000;
mongoose.set("strictQuery", false);

mongoose
  .connect(
    "mongodb+srv://patelnisarg3375:J9Zzi7Bh8Dq3b5OH@memories.wjtjf.mongodb.net/Memories?retryWrites=true&w=majority&appName=memories"
  )
  .then(() => {
    app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
  })
  .catch((error) => {
    console.log(error);
  });
