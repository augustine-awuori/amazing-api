const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();
const io = new Server(httpServer, {});

io.on("connection", (socket) => {
    socket.
});

httpServer.listen(5050);
