"use strict";
import mongoose, { Schema } from 'mongoose';
const ingredienteSchema = new Schema({
    nombre: {
        type: String,
        required: true,
    },
});
const Ingrediente = mongoose.model('Ingrediente', ingredienteSchema);
export default Ingrediente;
