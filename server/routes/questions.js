import express from "express";
import Question from "../models/Question.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { tag, q } = req.query;
  const filter = {};
  if (tag) filter.tags = tag;
  if (q) filter.title = { $regex: q, $options: "i" };
  const items = await Question.find(filter).sort({ createdAt: -1 }).populate("user", "name profilePic achievements").lean();
  res.json(items);
});

router.post("/", requireAuth, async (req, res) => {
  const { title, body, tags = [], media = [] } = req.body;
  const question = await Question.create({
    user: req.user.id, title, body, tags, media
  });
  const populated = await Question.findById(question._id).populate("user", "name profilePic achievements");
  res.status(201).json(populated);
});

router.get("/:id", async (req, res) => {
  const item = await Question.findById(req.params.id).populate("user", "name profilePic achievements").lean();
  res.json(item);
});

export default router;
