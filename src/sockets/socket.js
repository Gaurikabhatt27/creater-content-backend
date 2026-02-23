import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true
        }
    });

    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);

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
                socket.to(receiver).emit("receiveMessage", messageData);
            }
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });

    return io;
};