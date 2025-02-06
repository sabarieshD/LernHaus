require("dotenv").config();
const passport = require("passport");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../../models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET_ID,
      callbackURL: `${process.env.SERVER_URL}/auth/google/callback`,
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Use email to find the user in the database
        const userEmail = profile.emails[0].value;
        let user = await User.findOne({ userEmail });

        console.log("before user");
        console.log("User found:", user);
        

        if (!user) {
          // Create a new user if not found
          user = new User({
            googleId: profile.id, // Save Google ID for reference
            userName: profile.displayName,
            userEmail: userEmail,
            role: "user", // Default role, adjust as needed
          });
          
          await user.save();
        } else {
          // Update the Google ID if it's missing
          if (!user.googleId) {
            user.googleId = profile.id;
            await user.save();
          }
        }

        // Generate JWT token
        const token = jwt.sign(
          {
            _id: user._id,
            userName: user.userName,
            userEmail: user.userEmail,
            role: user.role,
          },
          process.env.JWT_SECRET,
          { expiresIn: "120m" }
        );

        console.log("OAuth Token:", token);

        user.token = token; // Attach token to user object if needed
        done(null, { user, token });
      } catch (error) {
        console.error("Error during OAuth:", error);
        done(error);
      }
    }
  )
);


// Serialize user for session (if using sessions)
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize user for session (if using sessions)
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});


const registerUser = async (req, res) => {
  try {
    const { userName, userEmail, password, role, collegeName, department, domainOfInterest, whatsappNumber } = req.body;

    // Check if all required fields are present
    if (!userName || !userEmail || !password || !role || !collegeName || !department || !domainOfInterest || !whatsappNumber) {
      return res.status(400).json({
        success: false,
        message: "All fields (username, email, password, role, collegeName, department, domainOfInterest, whatsappNumber) are required."
      });
    }

    // Check if the email or username already exists
    const existingUser = await User.findOne({
      $or: [{ userEmail }, { userName }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Username or email already exists",
      });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user object
    const newUser = new User({
      userName,
      userEmail,
      password: hashedPassword,
      role,
      collegeName,
      department,
      domainOfInterest,
      whatsappNumber
    });

    // Save the user to the database
    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "User registered successfully!",
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
};

const loginUser = async (req, res) => {
  const { userEmail, password } = req.body;
  
  if (!userEmail || !password) {
    console.log("Missing email or password");
    return res.status(400).json({
      success: false,
      message: "Both email and password are required",
    });
  }

  try {
    const checkUser = await User.findOne({ userEmail });
    console.log("User found:", checkUser);

    if (!checkUser) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const passwordMatch = await bcrypt.compare(password, checkUser.password);
    console.log("Password match:", passwordMatch);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const accessToken = jwt.sign(
      {
        _id: checkUser._id,
        userName: checkUser.userName,
        userEmail: checkUser.userEmail,
        role: checkUser.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "120m" }
    );

    console.log(accessToken);

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      data: {
        accessToken,
        user: {
          _id: checkUser._id,
          userName: checkUser.userName,
          userEmail: checkUser.userEmail,
          role: checkUser.role,
          collegeName: checkUser.collegeName,
          department: checkUser.department,
          domainOfInterest: checkUser.domainOfInterest,
          whatsappNumber: checkUser.whatsappNumber,
        },
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};


const viewUserDetails = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required in the request.",
      });
    }

    const user = await User.findOne({ userEmail: email }).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User details fetched successfully.",
      data: user,
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during fetching user details.",
    });
  }
};


const updateUserDetails = async (req, res) => {
  try {
    const userId = req.user._id;
    const { userName, userEmail, collegeName, department, domainOfInterest, whatsappNumber } = req.body;

    if (!userName || !userEmail || !collegeName || !department || !domainOfInterest || !whatsappNumber) {
      return res.status(400).json({
        success: false,
        message: "All fields (userName, userEmail, collegeName, department, domainOfInterest, whatsappNumber) are required.",
      });
    }

    const existingUser = await User.findOne({
      $or: [{ userEmail }, { userName }],
      _id: { $ne: userId },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Username or email already exists.",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId, 
      { userName, userEmail, collegeName, department, domainOfInterest, whatsappNumber },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User details updated successfully.",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user details:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during updating user details.",
    });
  }
};

module.exports = { registerUser, loginUser, updateUserDetails, viewUserDetails };