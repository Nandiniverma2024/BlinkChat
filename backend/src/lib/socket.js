import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app= express();
const server = http.createServer(app);


function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// online users map = { userId: socketId }
const userSocketMap = {};

// new Server(server) => SocketServer(httpServer)
const allowedOrigins = process.env.FRONTEND_URL || "http://localhost:5173";
const io = new Server(server, {cors: {origin: [allowedOrigins]}});

// socket => user which is connected
// AnyTime user logged in,io.on("connection", (socket)) is going to run, we will store the userId and socketId in userSocketMap
io.on("connection", (socket) => {
    // Get user id of this user
    const userId = socket.handshake.query.userId;

    if (userId) userSocketMap[userId] = socket.id;

    // io.emit() sends event to everyone - broadcast
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // socket.on is used to listen for events
    // if user is disconnected, delete user from online users map and broadcast the updated list
    socket.on("disconnect", () => {
        if (userId){
            delete userSocketMap[userId];
        }
        // after deletion, let everyone know that this user is offline now
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });

});


export { app, io, getReceiverSocketId, server };
