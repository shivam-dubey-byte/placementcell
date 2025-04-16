const notificationModel = require("../models/notificationModel");
const io = global._io; // ✅ use global instance

// Student/Admin fetch their own notifications
exports.getNotifications = async (req, res) => {
  try {
    const role = req.user.role; // 'student' or 'admin'
    const notifications = await notificationModel.getAllNotifications(req.user.email, role);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

// Student/Admin mark their own notifications as read
exports.markAsRead = async (req, res) => {
  try {
    const { title, createdAt } = req.body;
    const filter = { email: req.user.email };
    console.log(title);
    console.log(createdAt);
    console.log(req.body);
    console.log(filter);
    // Handle bulk mark all
    if (!(title === "*" && createdAt === "*")) {
      filter.title = title;
      filter.createdAt = new Date(createdAt);
    }
    console.log(filter);
    const result = await notificationModel.markNotificationRead(filter, req.user.role);
    // ✅ Send success response
    res.status(200).json({ message: "Marked as read", modifiedCount: result.modifiedCount });    

  } catch (error) {
    res.status(500).json({ message: "Failed to mark as read" });
  }
};

// Student creates in "admin" collection, Admin creates in "student" collection
exports.createNotification = async (req, res) => {
  try {
    console.log(req.body);
    const { title, message,broadcast=false } = req.body;
    const senderRole = req.user.role;
    const targetCollection = senderRole === "student" ? "admin" : "student";
    console.log(broadcast);
    if (broadcast) {
      console.log(4);
      const mode = targetCollection;
    
      // 🧠 Get user collection and fetch all emails with role == mode
      const userDB = await require("../connectDB1"); // Connect to user DB
      console.log(3)
      const db = await userDB("user");
      console.log(2);
      const userCollection = db.collection("users");
      console.log(1);
      console.log(userCollection);
    
      // 📨 Get all unique emails for the target role
      const recipients = await userCollection.distinct("email", { role: mode });
      console.log(recipients);
      if (recipients.length === 0) {
        return res.status(404).json({ message: `No ${mode} users found` });
      }
    
      // 🌐 Connect to the notification DB and target collection
      const notifDB = await require("../connectDB")("notification");
      const targetCol = notifDB.collection(mode);
    
      const createdAt= new Date();
      // 🛠 Create notifications for all
      const notifications = recipients.map((recipientEmail) => ({
        email: recipientEmail,
        title,
        message,
        isRead: false,
        createdAt,
      }));
    
      await targetCol.insertMany(notifications);
    
      // 📡 Emit socket notifications
      for (const recipient of recipients) {
        global._io.to(recipient).emit("new_notification", {
          email: recipient,
          title,
          message,
          isRead: false,
          createdAt: new Date(),
        });
      }
    
      return res.status(201).json({ message: "Broadcast notification sent to all " + mode + "s" });
    }
    else{
             const {email}=req.body;
            const result = await notificationModel.createNotification(
             { email, title, message },
             targetCollection
             );
             const io = global._io;
             if (io && typeof io.to === "function") {
               io.to(email).emit("new_notification", {
               email,
               title,
               message,
               isRead: false,
               createdAt: result.createdAt || new Date() 
               });
               console.log("📢 Notification emitted to:", email);
             } else {
               console.warn("⚠️ Socket.io not ready. Skipping emit.");
             }
       
           res.status(201).json({ message: "Notification created", createdAt: result.createdAt });
           }
           

  } catch (error) {
    res.status(500).json({ message: "Failed to create notification" });
  }
};
