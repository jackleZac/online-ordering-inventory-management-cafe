require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { WebSocketServer } = require('ws');

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// Port Configuration
const port = process.env.PORT;

// Connect to MongoDB
mongoose.connect(process.env.DB, { dbName: 'cafe' })
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas')
  })
  .catch((err) => {
    console.log('Failed to connect to MongoDB Atlas', err)
    process.exit(1)
});

// Import routes
const menuRoutes = require("./routes/menuRoutes");
const authRoutes = require("./routes/authRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const ordersRoutes = require("./routes/ordersRoutes");
const inventoryRoutes = require("./routes/inventory/inventoryRoutes");
const itemsRoutes = require("./routes/inventory/itemsRoutes");
const batchesRoutes = require("./routes/inventory/batchesRoutes");
const suppliersRoutes = require("./routes/inventory/supplierRoutes");

// Use routes
app.use("/", authRoutes);
app.use("/menu", menuRoutes);
app.use("/payment", paymentRoutes);
app.use("/admin/orders", ordersRoutes);
app.use("/admin/inventory", inventoryRoutes);
app.use("/admin/items", itemsRoutes);
app.use("/admin/batches", batchesRoutes);
app.use("/admin/suppliers", suppliersRoutes);

// Wrap Express app with HTTP server for WebSockets
const server = require('http').createServer(app);

// Create WebSocket server
const wss = new WebSocketServer({ server });

// Function to broadcast messages to all clients
function broadcastMessage(data) {
  wss.clients.forEach(client => {
    if (client.readyState === client.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

// Make WebSocket server & broadcast function available to routes
app.locals.wss = wss;
app.locals.broadcastMessage = broadcastMessage;

// Start Express Server
server.listen(port, () => {
  console.log(`Server listens on PORT ${port}`)
});

process.on('SIGINT', async () => {
  await mongoose.connection.close()
  console.log('MongoDB connection closed through app termination')
  process.exit(0)
});