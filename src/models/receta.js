const mongoose = require('mongoose');

const recetaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  ingredientes: {
    type: String,
    required: true,
  },
  instrucciones: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Receta', recetaSchema);
