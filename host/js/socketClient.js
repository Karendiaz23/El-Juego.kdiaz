import { io } from "socket.io-client";

const socket = io("http://10.56.2.65:3000");

socket.on("connect", () => {
  console.log("HOST CONECTADO");
});

export default socket;