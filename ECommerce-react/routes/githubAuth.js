import express from "express";
import axios from "axios";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { db } from "../db.js"; // your MySQL connection

const router = express.Router();

// Callback route GitHub redirects to
router.get("/github/callback", async (req, res) => {
  const { code } = req.query;

  if (!code) return res.status(400).send("Code not provided");

  try {
    // 1️⃣ Exchange code for access token
    const tokenRes = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      { headers: { Accept: "application/json" } }
    );

    const access_token = tokenRes.data.access_token;
    if (!access_token) return res.status(401).send("Failed to get access token");

    // 2️⃣ Get user info from GitHub
    const userRes = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `token ${access_token}` },
    });

    const { login, id, email, avatar_url } = userRes.data;

    // 3️⃣ Optional: fetch primary verified email if null
    let userEmail = email;
    if (!userEmail) {
      const emailsRes = await axios.get("https://api.github.com/user/emails", {
        headers: { Authorization: `token ${access_token}` },
      });
      const primaryEmail = emailsRes.data.find(e => e.primary && e.verified);
      userEmail = primaryEmail ? primaryEmail.email : null;
    }

    // 4️⃣ Save or find user in DB
    db.query(
      "SELECT * FROM users WHERE github_id = ? LIMIT 1",
      [id],
      (err, results) => {
        if (err) return res.status(500).json({ message: "DB error", err });

        let user;

        if (results.length === 0) {
          // Register new user
          user = {
            user_uuid: uuidv4(),
            username: login,
            github_id: id,
            email: userEmail,
            avatar: avatar_url,
            provider: "github",
          };

          db.query("INSERT INTO users SET ?", user);
        } else {
          user = results[0];
        }

        // 5️⃣ Issue JWT
       // 5️⃣ Issue YOUR JWT
        const token = jwt.sign(
            { user_uuid: user.user_uuid },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "1d" }
        );

        // 6️⃣ Store it in HttpOnly cookie
        res.cookie("access_token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000
        });

        // 7️⃣ Redirect WITHOUT ANY TOKEN
        res.redirect(`${process.env.FRONTEND_URL}/github-success`);
        // 6️⃣ Redirect to frontend with token
        // res.redirect(`${process.env.FRONTEND_URL}/github-success?token=${token}&userUUID=${user.user_uuid}`);
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "GitHub OAuth error", err });
  }
});

export default router;
