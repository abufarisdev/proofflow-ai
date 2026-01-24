import axios from "axios";
import dotenv from "dotenv";
import { admin, isFirebaseInitialized } from "../config/firebase.js";

dotenv.config();

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

export const getGithubAuthUrl = (req, res) => {
  const redirectUri = `${req.protocol}://${req.get(
    "host"
  )}/auth/github/callback`;
  const url = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=user:email`;
  res.json({ url });
};

export const exchangeCodeForToken = async (req, res) => {
  const { code } = req.body;

  try {
    // Exchange code for GitHub access token
    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
      },
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    const { access_token } = tokenResponse.data;

    if (!access_token) {
      return res.status(400).json({ error: "Failed to get access token" });
    }

    // Get GitHub user info
    const userResponse = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const githubUser = userResponse.data;

    // Get user email
    let email = githubUser.email;
    if (!email) {
      const emailsResponse = await axios.get(
        "https://api.github.com/user/emails",
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      const primaryEmail = emailsResponse.data.find((email) => email.primary);
      email = primaryEmail ? primaryEmail.email : null;
    }

    if (!email) {
      return res.status(400).json({ error: "No email found for GitHub user" });
    }

    // Check if Firebase is initialized
    if (!isFirebaseInitialized()) {
      return res.status(500).json({ error: "Firebase is not initialized. Please check server configuration." });
    }

    // Create or update Firebase user and set github info as custom claims
    try {
      let firebaseUid;
      let firebaseUserRecord;
      try {
        firebaseUserRecord = await admin.auth().getUserByEmail(email);
      } catch (err) {
        if (err.code === "auth/user-not-found") {
          firebaseUserRecord = await admin.auth().createUser({
            email,
            displayName: githubUser.login,
            photoURL: githubUser.avatar_url,
          });
        } else {
          throw err;
        }
      }
      firebaseUid = firebaseUserRecord.uid;

      // Update user record with latest GitHub info
      await admin.auth().updateUser(firebaseUid, {
        displayName: githubUser.login,
        photoURL: githubUser.avatar_url,
      });

      // Set custom claims so middleware can read the GitHub username reliably
      await admin.auth().setCustomUserClaims(firebaseUid, {
        provider: "github",
        githubId: githubUser.id,
        githubUsername: githubUser.login,
      });

      // Create custom token for the Firebase uid
      const firebaseToken = await admin.auth().createCustomToken(firebaseUid);

      res.json({
        access_token,
        firebase_token: firebaseToken,
        user: {
          id: githubUser.id,
          firebaseUid,
          username: githubUser.login,
          email,
          avatar_url: githubUser.avatar_url,
        },
      });
    } catch (err) {
      console.error("Error creating/updating Firebase user", err);
      return res.status(500).json({ error: "Failed to create or update Firebase user" });
    }
  } catch (error) {
    console.error("Error exchanging code for token", error);
    res.status(500).json({ error: "Failed to exchange code for token" });
  }
};
