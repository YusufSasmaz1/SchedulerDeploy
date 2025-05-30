//Mongo log in and info is not in public folder, so pull it from private .env file
require("dotenv").config();

// server.js
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})  
  .then(() => console.log("✅  MongoDB connection successful"))
  .catch(err => console.error("❌  MongoDB connection error:", err));

// Define user model
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName:  String,
  email:     String,
  password:  String
}, { collection: "users" });  // insert all data into the "users" collection in Mongo

const User = mongoose.model("User", userSchema);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Serve Sign Up page by default
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "FirstPage_Scheduler.html"));
});

// Serve Sign In page at /signin
app.get("/signin", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "SignInPage_Scheduler.html"));
});

// Save user after succesful sign up
app.post("/signup", async (req, res) => {
  
  try {
    const { firstName, lastName, email, password } = req.body;
    const newUser = new User({ firstName, lastName, email, password });
    await newUser.save();
    console.log("💾  User saved:", newUser);
    res.redirect("/SignInPage_Scheduler.html");
  } catch (err) {
    console.error("❌  Error saving user:", err);
    res.status(500).send("Error saving user");
  }
});

// Check for valid email and password
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });
    if (user) {
      console.log("✅  Login successful:", email);
      res.send("Login successful!"); // You can redirect to a dashboard here
      
    } else {
      console.log("❌  Invalid login attempt:", email);
      res.status(401).send("Invalid email or password");
    }
  } catch (err) {
    console.error("❌  Error during login:", err);
    res.status(500).send("Login error");
  }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
