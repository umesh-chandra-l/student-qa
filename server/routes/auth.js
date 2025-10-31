import express from "express";
import passport from "passport";
import { makeJwt } from "../auth/passport.js";
import User from "../models/User.js";

const router = express.Router();

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/" }),
  async (req, res) => {
    const token = makeJwt(req.user);
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false
    });
    res.redirect(process.env.CLIENT_URL);
  }
);

router.get("/me", async (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.json(null);
  try {
    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
    const user = await User.findById(payload.id).lean();
    res.json(user);
  } catch {
    res.json(null);
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ ok: true });
});

router.patch("/me/achievements", async (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ error: "Not authenticated" });
  try {
    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
    const user = await User.findByIdAndUpdate(payload.id, { achievements: req.body.achievements || [] }, { new: true });
    res.json(user);
  } catch {
    res.status(400).json({ error: "Update failed" });
  }
});

export default router;
