import { createAdapter } from "@socket.io/redis-adapter";
import { Server } from "socket.io";
import { pubClient, subClient } from "../config/redis.js";

let io;
const userSockets = {};

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: ["http://localhost:5173","http://localhost:5174"],
            credentials: true
        }
    });

    io.adapter(createAdapter(pubClient, subClient));

    io.on("connection", async (socket) => {
        console.log("A user connected:", socket.id);

        const userId = socket.handshake.query.userId;

        if (userId && userId !== "undefined") {

            await pubClient.sAdd(`online:${userId}`, socket.id);

            if (!userSockets[userId]) userSockets[userId] = [];
            userSockets[userId].push(socket.id);
        }


        const keys = await pubClient.keys("online:*");
        const onlineUsers = keys.map(key => key.split(":")[1]);

        io.emit("getOnlineUsers", onlineUsers);

        socket.on("join", (userId) => {
            socket.join(userId);
            console.log(`User ${userId} joined room`);
        });

        socket.on("typing", ({ senderId, receiverId }) => {
            socket.to(receiverId).emit("typing", { senderId });
        });

        socket.on("sendMessage", (messageData) => {
            const { receiver } = messageData;

            if (receiver) {
                io.to(receiver).emit("receiveMessage", messageData);
            }
        });

        socket.on("disconnect", async () => {
            console.log("User disconnected:", socket.id);

            if (userId && userId !== "undefined") {

                await pubClient.sRem(`online:${userId}`, socket.id);

                const remaining = await pubClient.sCard(`online:${userId}`);

                if (remaining === 0) {
                    await pubClient.del(`online:${userId}`);
                }

                if (userSockets[userId]) {
                    userSockets[userId] = userSockets[userId].filter(id => id !== socket.id);
                    if (userSockets[userId].length === 0) {
                        delete userSockets[userId];
                    }
                }
            }

            const keys = await pubClient.keys("online:*");
            const onlineUsers = keys.map(key => key.split(":")[1]);

            io.emit("getOnlineUsers", onlineUsers);
        });
    });

    return io;
};