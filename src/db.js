// src/db.js
const mongoose = require('mongoose');
const config = require('./config.json');

const connectDB = async () => {
    try {
        await mongoose.connect(config.mongoURI, { // Asegúrate de que config.mongoURI esté definido
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Conectado a MongoDB');
    } catch (error) {
        console.error('Error conectando a MongoDB:', error);
        process.exit(1); // Termina el proceso si la conexión falla
    }
};

module.exports = connectDB;
