"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const Receta = require('../models/receta2');
const obtenerRecetas = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const recetas = yield Receta.find().populate('ingredientes instrucciones');
        return recetas;
    }
    catch (error) {
        console.error('Error al obtener las recetas:', error);
        return [];
    }
});
const obtenerRecetaPorNombre = (nombre) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const receta = yield Receta.findOne({ nombre }).populate('ingredientes instrucciones');
        return receta;
    }
    catch (error) {
        console.error('Error al obtener la receta:', error);
        return null;
    }
});
module.exports = {
    obtenerRecetas,
    obtenerRecetaPorNombre,
};
