import { io } from "socket.io-client";

const socket = io("http://192.168.0.30:3000");

socket.on("connect", () => {
  console.log("HOST CONECTADO");
});

export default socket;