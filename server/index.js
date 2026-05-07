import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, { cors: { origin: '*' } }); // cors solo para test en el ejemplo!

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static('public'));

// Manejar conexiones de clientes
io.on('connection', (socket) => {
  console.log('Cliente conectado');

  // Manejar mensajes del cliente
  socket.on('message', (message) => {
    console.log('Mensaje recibido:', message);
    
    // Enviar mensaje a todos los clientes, incluido el que envió el mensaje
    io.emit('message', message);
  });

  // Manejar desconexiones
  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor Socket.IO iniciado en http://localhost:${PORT}`);
});
