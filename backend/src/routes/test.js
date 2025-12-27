import express from "express";

import firebaseAuth from "../middleware/firebaseAuth.js";



const router = express.Router();



router.get("/me", firebaseAuth, (req, res) => {

  res.json({

    uid: req.user.uid,

    email: req.user.email,

  });

});



export default router;

