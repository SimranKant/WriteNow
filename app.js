// ============================
// app.js — Main Express Server
// ============================

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const port = process.env.PORT || 3000;
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/users.js");
const MongoStore = require("connect-mongo");
const { isLoggedIn } = require("./middleware.js");

const Message = require("./models/Message.js"); // 🟢 Added for chat messages

// ---- Routes ----
const postsRouter = require("./routes/posts.js");
const commentsRouter = require("./routes/comments.js");
const usersRouter = require("./routes/users.js");
const landingRouter = require("./routes/landing");
const chatRouter = require("./routes/chat.js"); // 🟢 Chat route added

// ---- MongoDB Connection ----
const dbUrl = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/chatApp";

main()
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

async function main() {
  await mongoose.connect(dbUrl);
}

// ---- Express Setup ----
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// ---- Session Setup ----
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: { secret: process.env.SECRET_CODE || "secret" },
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.log("ERROR IN MONGO SESSION STORE", err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET_CODE || "secret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

// ---- Passport Setup ----
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ---- Global Locals ----
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// ---- Routes ----
app.get("/favicon.ico", (req, res) => res.status(204).end());

// Team route (unchanged)
app.get("/team", (req, res) => {
  const developers = [
    {
      name: "Simran Kant",
      role: "Full Stack Developer",
      image: "/images/simran.jpg",
      github: "https://github.com/simrankant",
      linkedin: "https://www.linkedin.com/in/simrankant/",
    },
    {
      name: "Jane Doe",
      role: "UI/UX Designer",
      image: "/images/megha.jpg",
      github: "https://github.com/janedoe",
      linkedin: "https://www.linkedin.com/in/janedoe/",
    },
    {
      name: "John Smith",
      role: "Backend Developer",
      image: "/images/dev3.jpg",
      github: "https://github.com/johnsmith",
      linkedin: "https://www.linkedin.com/in/johnsmith/",
    },
  ];
  res.render("landing/team", { developers });
});

// 🟢 Chat Route
app.use("/chat", isLoggedIn, chatRouter);

// Existing app routes
app.use("/posts", postsRouter);
app.use("/posts/:id/comments", commentsRouter);
app.use("/users", usersRouter);
app.use("/", landingRouter);

// ---- Error Handling ----
app.all("/{*any}", (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

// =======================
// 🟢 Socket.IO Integration
// =======================
const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("🟢 A user connected:", socket.id);

  socket.on("registerUser", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(`✅ User ${userId} is online`);
  });

  socket.on("privateMessage", async ({ sender, receiver, message }) => {
    console.log(`💬 ${sender} → ${receiver}: ${message}`);

    // Save the message
    const newMsg = new Message({ sender, receiver, message });
    await newMsg.save();

    // Deliver to receiver if online
    const receiverSocket = onlineUsers.get(receiver);
    if (receiverSocket) {
      io.to(receiverSocket).emit("privateMessage", { sender, message });
    }
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
    for (const [userId, id] of onlineUsers.entries()) {
      if (id === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
  });
});

// ---- Start Server ----
server.listen(port, () => {
  console.log(`🚀 App running at http://localhost:${port}`);
});
