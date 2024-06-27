const WebSocket = require('ws');
const readline = require('readline');

// Create a new WebSocket server
const wss = new WebSocket.Server({ port: 9080 });

// Function to handle new connections
wss.on('connection', (ws) => {
  console.log('New client connected');

  // Send a welcome message to the new client
  // ws.send(JSON.stringify({ message: 'Welcome to the WebSocket server!' }));
  ws.send(JSON.stringify({ message: 'Type messages in the terminal to send to all connected clients.' }));
  ws.send(JSON.stringify({ message: 'Type "exit" to close the server.' }));
  // Function to handle incoming messages
  ws.on('message', (message) => {
    try {
      // Parse the received message as JSON
      const data = JSON.parse(message);
      console.log('Received data:', data);

      // Handle the parsed data and send a response back to the client
      if (data.type === 'greeting') {
        ws.send(JSON.stringify({ message: `Hello, ${data.name}` }));
      } else {
        ws.send(JSON.stringify({ message: 'Unknown message type' }));
      }
    } catch (error) {
      console.error('Error parsing message:', error);
      ws.send(JSON.stringify({ error: 'Invalid JSON' }));
    }
  });

  // Function to handle client disconnections
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Function to broadcast messages to all connected clients
function broadcast(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

// Set up terminal input listener
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  const newData = { message: input, timestamp: new Date() };
  broadcast(newData);
});

console.log('WebSocket server is running on ws://localhost:8080');
console.log('Type messages in the terminal to send to all connected clients.');
