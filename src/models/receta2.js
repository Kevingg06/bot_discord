// receta2.js
const mongoose = require('mongoose');
const { Schema, model } = mongoose;

// Esquema de Receta
const recetaSchema = new Schema({
  nombre: { type: String, required: true },
  ingredientes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ingrediente' }],
  instrucciones: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Instruccion' }],
  imagenUrl: { type: mongoose.Schema.Types.ObjectId, ref: 'ImagenUrl' }
});

// Crear el modelo Receta
const Receta = model('Receta', recetaSchema);

module.exports = Receta;  // Exportación correcta
