import express from "express";
import Answer from "../models/Answer.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/by-question/:qid", async (req, res) => {
  const list = await Answer.find({ question: req.params.qid })
    .sort({ createdAt: -1 })
    .populate("user", "name profilePic achievements")
    .lean();
  res.json(list);
});

router.post("/", requireAuth, async (req, res) => {
  const { question, body, media = [] } = req.body;
  const ans = await Answer.create({ question, body, media, user: req.user.id });
  const populated = await Answer.findById(ans._id).populate("user", "name profilePic achievements");
  res.status(201).json(populated);
});

router.post("/:id/upvote", requireAuth, async (req, res) => {
  const a = await Answer.findById(req.params.id);
  if (!a) return res.status(404).json({ error: "Not found" });
  const idx = a.upvotes.findIndex(u => String(u) === req.user.id);
  if (idx >= 0) a.upvotes.splice(idx, 1); else a.upvotes.push(req.user.id);
  await a.save();
  res.json({ upvotes: a.upvotes.length });
});

export default router;
