//Mongo log in and info is not in public folder, so pull it from private .env file
require("dotenv").config();

// server.js
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

const app = express();

// Connects to MongoDB using credentials from .env
const dbOptions = { useNewUrlParser: true, useUnifiedTopology: true };
mongoose.connect(process.env.MONGODB_URI, dbOptions)  
  .then(() => console.log("✅  MongoDB connection successful"))
  .catch(err => console.error("❌  MongoDB connection error:", err));

// Defines the user schema/model for MongoDB
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName:  String,
  email:     String,
  password:  String
}, { collection: "users" });

const User = mongoose.model("User", userSchema);

// Defines the event schema/model for MongoDB
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

// Serves the sign up page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Serves the sign in page
app.get("/signin", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "signin.html"));
});

// Serves the calendar page
app.get(["/calendar", "/calendar.html"], (req, res) => {
  res.sendFile(path.join(__dirname, "public", "calendar.html"));
});

// Handles user sign up and saves user to database
app.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const newUser = new User({ firstName, lastName, email, password });
    await newUser.save();
    res.redirect("/signin");
  } catch (err) {
    res.status(500).send("Error saving user");
  }
});

// Handles user login and checks credentials
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });
    if (user) {
      res.json({ 
        success: true, 
        userId: user._id,
        message: "Login successful!" 
      });
    } else {
      res.status(401).send("Invalid email or password");
    }
  } catch (err) {
    res.status(500).send("Login error");
  }
});

// Handles adding a new event to the database
app.post("/api/events", async (req, res) => {
  try {
    const { userId, ...eventData } = req.body;
    const newEvent = new Event({ userId, ...eventData });
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(500).send("Error saving event");
  }
});

// Retrieves all events for a specific user
app.get("/api/events/:userId", async (req, res) => {
  try {
    const events = await Event.find({ userId: req.params.userId });
    res.json(events);
  } catch (err) {
    res.status(500).send("Error fetching events");
  }
});

// Deletes an event by its ID
app.delete("/api/events/:eventId", async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.eventId);
    res.status(200).send("Event deleted");
  } catch (err) {
    res.status(500).send("Error deleting event");
  }
});

// Handles all other routes (404 Not Found)
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
});

// Starts the server on the specified port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
