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

// Define event model
const eventSchema = new mongoose.Schema({
  userId: String,
  title: String,
  selectedDate: String,
  time1Value: String,
  time2Value: String,
  isAllDay: Boolean,
  isRepeat: Boolean,
  repeatDate: String,
  typeEvent: String
}, { collection: "events" });

const Event = mongoose.model("Event", eventSchema);

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

// Serve Calendar page
app.get(["/calendar", "/MonthCalendar.html"], (req, res) => {
  res.sendFile(path.join(__dirname, "public", "MonthCalendar.html"));
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
      res.json({ 
        success: true, 
        userId: user._id,
        message: "Login successful!" 
      });
    } else {
      console.log("❌  Invalid login attempt:", email);
      res.status(401).send("Invalid email or password");
    }
  } catch (err) {
    console.error("❌  Error during login:", err);
    res.status(500).send("Login error");
  }
});

// Add new event
app.post("/api/events", async (req, res) => {
  try {
    const { userId, ...eventData } = req.body;
    const newEvent = new Event({ userId, ...eventData });
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (err) {
    console.error("Error saving event:", err);
    res.status(500).send("Error saving event");
  }
});

// Get user's events
app.get("/api/events/:userId", async (req, res) => {
  try {
    const events = await Event.find({ userId: req.params.userId });
    res.json(events);
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).send("Error fetching events");
  }
});

// Delete event
app.delete("/api/events/:eventId", async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.eventId);
    res.status(200).send("Event deleted");
  } catch (err) {
    console.error("Error deleting event:", err);
    res.status(500).send("Error deleting event");
  }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
