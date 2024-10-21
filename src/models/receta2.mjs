"use strict";
import mongoose, { Schema } from 'mongoose';
const recetaSchema = new Schema({
    nombre: {
        type: String,
        required: true,
    },
    ingredientes: [{
            type: Schema.Types.ObjectId,
            ref: 'Ingrediente',
        }],
    instrucciones: [{
            type: Schema.Types.ObjectId,
            ref: 'Instruccion',
        }],
});
const Receta = mongoose.model('Receta', recetaSchema);
export default Receta;
