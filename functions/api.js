const express = require('express');
const cors = require('cors');
const connectDB = require('../src/config/db');
const lembretesRoutes = require('../src/routes/lembretes');
require('dotenv').config();

const app = express();

// Conectar ao MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/lembretes', lembretesRoutes);

// Handler para o Netlify
exports.handler = async (event, context) => {
  return new Promise((resolve, reject) => {
    const server = app.listen(0, () => {
      const { port } = server.address();
      const url = `http://localhost:${port}${event.path}`;
      
      fetch(url, {
        method: event.httpMethod,
        headers: event.headers,
        body: event.body
      })
        .then(response => response.json())
        .then(data => {
          server.close();
          resolve({
            statusCode: 200,
            body: JSON.stringify(data)
          });
        })
        .catch(error => {
          server.close();
          reject(error);
        });
    });
  });
}; 