const app = require("./app");
const http = require("http");
const { Server } = require("socket.io");

const PORT = process.env.PORT || 5009;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PATCH"]
  }
});

global._io = io; // ✅ THIS MUST COME BEFORE requiring routes/controllers

io.on("connection", (socket) => {
  console.log("🟢 Client connected:", socket.id);

  socket.on("join", (email) => {
    socket.join(email);
    console.log(`📩 User ${email} joined notification room`);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

//module.exports.io = io;

server.listen(PORT, () => {
  console.log(`🚀 Notification service running on port ${PORT}`);
});
