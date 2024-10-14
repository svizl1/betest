/***********************************************
 *                                              *
 *   This File handles user account creation    *
 *                                              *
 ***********************************************/
const bcrypt = require("bcrypt");
const User = require("../models/User");

//Import jwt
const jwt = require("jsonwebtoken");
//Import speakeasy
const speakeasy = require("speakeasy");

//Password rules:
const min = 12; //min length
const max = 18; // max length

function validatePassword(password) {
  return password.length >= min && password.length <= max;
}

//Help prevent noSQL injecton via validation regex
function validateUsername(username) {
  const usernameRegex = /^[a-zA-Z0-9]+$/;
  return usernameRegex.test(username);
}

//Help prevent noSQL injecton via validation regex
function validateEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

function verify2FAToken(userSecret, token) {
  return speakeasy.totp.verify({
    secret: userSecret,
    encoding: "base32",
    token: token,
  });
}

async function createUser(req, res) {
  const { username, email, password } = req.body;
  try {
    // Check if username and email are provided

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Username, email, and password are required" });
    }

    // Validate username (no symbols)
    if (!validateUsername(username)) {
      return res
        .status(400)
        .json({ message: "Username cannot contain symbols" });
    }

    // Validate username (no symbols)
    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Validate password (minimum length)
    valid = validatePassword(password);
    if (valid == false) {
      return res.status(400).json({
        message:
          "Password must be between " +
          min +
          " and " +
          max +
          " characters long",
      });
    }

    // Check DB: if username is already taken
    let existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username is already taken" });
    }

    // Check DB: if email is already registered
    existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    const hashedPW = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPW,
      isAdmin: false,
      twoFactorAuthenticationSecret: speakeasy.generateSecret().base32,
    });

    //save to DB
    await newUser.save();

    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Server error" });
  }
}




//Login User functionality
async function loginUser(req, res) {
  const { username, password, token } = req.body;

  // Find the user by username
  try {
    let user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }




    // Compare password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // if (!verify2FAToken(user.twoFactorAuthenticationSecret, token)) {
    //   return res.status(400).json({ message: "Invalid 2FA token" });
    // }

    // Check if the account is enabled
    if (!user.account_enabled) {
      return res.status(403).json({ message: "Account is not enabled." });
    }

    // Generate a token
    const authToken = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // res.json({ message: "Login successful", token:authToken });
    // Send user info along with the token
    res.json({
      message: "Login successful",
      token: authToken,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        // Include any other user information you want to send
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// Update User Profile
async function updateUserProfile(req, res) {
  const userId = req.user.userId; // Extract user ID from the JWT token
  const { username, email, password } = req.body;

  try {
    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate and update user fields
    if (username) user.username = username;
    if (email) user.email = email;

    // Hash new password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await user.save();
    const { password: hashedPassword, ...otherDetails } = updatedUser._doc; // Do not send password in response
    res
      .status(200)
      .json({ message: "Profile updated successfully", user: otherDetails });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  createUser,
  loginUser,
  verify2FAToken,
  updateUserProfile,
};
