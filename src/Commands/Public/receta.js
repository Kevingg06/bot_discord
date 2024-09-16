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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const ingrediente_1 = __importDefault(require("../../models/ingrediente")); // Ajusta la ruta
const instruccion_1 = __importDefault(require("../../models/instruccion")); // Ajusta la ruta
const receta_1 = __importDefault(require("../../models/receta")); // Ajusta la ruta
exports.default = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('receta')
        .setDescription('Añade una receta.')
        .addStringOption(option => option.setName('nombre')
        .setDescription('Nombre de la receta')
        .setRequired(true))
        .addStringOption(option => option.setName('ingredientes')
        .setDescription('Ingredientes de la receta (separados por comas)')
        .setRequired(true))
        .addStringOption(option => option.setName('instrucciones')
        .setDescription('Instrucciones de la receta (separadas por punto y coma)')
        .setRequired(true)),
    /**
     * Ejecuta el comando en la interacción de chat.
     *
     * @param {ChatInputCommandInteraction} interaction - La interacción de comando de entrada de chat.
     * @param {Client<boolean>} client - El cliente de Discord.
     */
    execute(interaction, client) {
        return __awaiter(this, void 0, void 0, function* () {
            const nombre = interaction.options.getString('nombre');
            const ingredientesString = interaction.options.getString('ingredientes');
            const instruccionesString = interaction.options.getString('instrucciones');
            if (!nombre || !ingredientesString || !instruccionesString) {
                yield interaction.reply({
                    content: 'Faltan parámetros para guardar la receta.',
                    ephemeral: true,
                });
                return;
            }
            try {
                const ingredientes = ingredientesString.split(',').map(ingrediente => {
                    return new ingrediente_1.default({
                        nombre: ingrediente.trim(),
                        cantidad: 'N/A', // Ajusta según tus necesidades
                    });
                });
                const instrucciones = instruccionesString.split(';').map((descripcion, index) => {
                    return new instruccion_1.default({
                        paso: index + 1,
                        descripcion: descripcion.trim(),
                    });
                });
                // Guardar ingredientes e instrucciones en la base de datos
                const ingredientesSaved = yield Promise.all(ingredientes.map(ingrediente => ingrediente.save()));
                const instruccionesSaved = yield Promise.all(instrucciones.map(instruccion => instruccion.save()));
                const nuevaReceta = new receta_1.default({
                    nombre: nombre.trim(),
                    ingredientes: ingredientesSaved.map(ingrediente => ingrediente._id),
                    instrucciones: instruccionesSaved.map(instruccion => instruccion._id),
                });
                yield nuevaReceta.save();
                yield interaction.reply({
                    content: `Receta '${nombre.trim()}' guardada exitosamente.`,
                    ephemeral: true,
                });
            }
            catch (error) {
                console.error('Error guardando la receta:', error);
                yield interaction.reply({
                    content: 'Hubo un error al guardar la receta.',
                    ephemeral: true,
                });
            }
        });
    }
};
