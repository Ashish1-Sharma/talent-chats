import express from "express";
import http from "http";
import { Server } from "socket.io";
import Pusher from "pusher";
import { json } from "express";
import { group } from "console";
const app = express();
const server = http.createServer(app);

// Enable CORS for Socket.io (if needed)
const io = new Server(server, {
    cors: {
        origin: "*",  // Allow connections from any domain (use specific URLs in production)
        methods: ["GET", "POST"]
    }
});


server.listen(3000, () => {
    console.log("Server is running on port 3000");
});

io.on("connection", (socket) => {
    try {
        console.log("a user connected");

        socket.on("joinGroup", (gId) => {
            socket.join(gId);
            console.log(`User joined group ${gId}`);
        });

        socket.on("message", (data) => {
            if (typeof data === "string") {
                data = JSON.parse(data);
            }
            console.log("Raw received data:", data.gId); // Debugging
        

            // Send the message only to users in the same group (excluding the sender)
            socket.emit(data.gId, data);

        });

        socket.on("disconnect", () => {
            console.log("A user disconnected");
            socket.disconnect();
        });
    } catch (e) {
        console.log(e)
    }
});

