"use strict";
// src/models/receta.js
const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const recetaSchema = new Schema({
    nombre: { type: String, required: true },
    ingredientes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ingrediente' }],
    instrucciones: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Instruccion' }],
    imagenUrl: { type: mongoose.Schema.Types.ObjectId, ref: 'ImagenUrl' }, // Relación con ImagenUrl
});
const Receta = model('Receta', recetaSchema);
module.exports = Receta;
