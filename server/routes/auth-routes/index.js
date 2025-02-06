require("dotenv").config();
const express = require("express");
const passport = require("passport");
const { registerUser, loginUser, updateUserDetails, viewUserDetails } = require("../../controllers/auth-controller/index");
const authenticateMiddleware = require("../../middleware/auth-middleware");
const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email']}));
router.get('/google/callback', 
            passport.authenticate('google', { 
            successRedirect: `${process.env.BASE_URL}/home`,
            failureRedirect: `${process.env.BASE_URL}/login` 
  }),(req, res) => {
    res.redirect(`${process.env.BASE_URL}/home`);
  }
);

router.post('/success', (req, res) => {
  res.status(200).json({message: "successfully implemented OAuth"});
})

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect(process.env.BASE_URL);
})

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get('/view-details/:email', viewUserDetails);

router.put("/update-details", authenticateMiddleware, updateUserDetails);

router.get("/check-auth", authenticateMiddleware, (req, res) => {
  const { user } = req;

  return res.status(200).json({
    success: true,
    message: "User authenticated successfully!",
    data: user,
  });
});

module.exports = router;
