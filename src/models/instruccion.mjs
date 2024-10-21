"use strict";
import mongoose, { Schema } from 'mongoose';
const instruccionSchema = new Schema({
    paso: {
        type: Number,
        required: true,
    },
    descripcion: {
        type: String,
        required: true,
    },
});
const Instruccion = mongoose.model('Instruccion', instruccionSchema);
export default Instruccion;
