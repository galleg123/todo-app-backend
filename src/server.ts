import express from "express";
import morgan from "morgan";
import cors from "cors";
import { protect } from "./modules/auth";
import router from "./router";
import { handleInputErrors } from "./modules/middleware";
import { createNewUser, signIn } from "./handlers/user";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extendex: true }));

app.get("/", (req, res, next) => {
  res.json({ message: "hello" });
});

app.use("/api", protect, router);
app.post("/user/create", handleInputErrors, createNewUser);
app.post("/user/signin", handleInputErrors, signIn);

app.use((err, req, res, next) => {
  if (err.type === "auth") {
    res.status(401).json({ message: "unauthorized" });
  } else if (err.type === "input") {
    res.status(400).json({ message: "invalid input" });
  } else {
    res.status(500).json({ message: "oops, thats on us" });
  }
});

export default app;
