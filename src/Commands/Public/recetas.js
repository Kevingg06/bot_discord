const { SlashCommandBuilder } = require('discord.js');
const Receta = require('../../models/receta2.js').default; 
const Ingrediente = require('../../models/ingrediente.js').default;
const Instruccion = require('../../models/instruccion.js').default; 

module.exports = {
    data: new SlashCommandBuilder()
        .setName('new_receta')
        .setDescription('Añade una receta.')
        .addStringOption(option => 
            option.setName('nombre')
                .setDescription('Nombre de la receta')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('ingredientes')
                .setDescription('Ingredientes de la receta (separados por comas)')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('instrucciones')
                .setDescription('Instrucciones de la receta (separadas por saltos de línea)')
                .setRequired(true)),

    async execute(interaction) {
        const nombre = interaction.options.getString('nombre');
        const ingredientesInput = interaction.options.getString('ingredientes').split(',').map(ing => ing.trim());
        const instruccionesInput = interaction.options.getString('instrucciones').split('\n').map(ins => ins.trim());

        try {
            // Crear y guardar ingredientes
            const ingredientesIds = await Promise.all(ingredientesInput.map(async (nombre) => {
                const nuevoIngrediente = new Ingrediente({ nombre });
                const ingredienteGuardado = await nuevoIngrediente.save();
                return ingredienteGuardado._id;
            }));

            // Crear y guardar instrucciones
            const instruccionesIds = await Promise.all(instruccionesInput.map(async (descripcion, index) => {
                const nuevaInstruccion = new Instruccion({ paso: index + 1, descripcion });
                const instruccionGuardada = await nuevaInstruccion.save();
                return instruccionGuardada._id;
            }));

            // Crear y guardar la receta
            const nuevaReceta = new Receta({
                nombre: nombre.trim(),
                ingredientes: ingredientesIds,
                instrucciones: instruccionesIds,
            });

            await nuevaReceta.save();

            await interaction.reply({
                content: `Receta '${nombre.trim()}' guardada exitosamente.`,
                ephemeral: true,
            });
        } catch (error) {
            console.error('Error guardando la receta:', error);
            await interaction.reply({
                content: 'Hubo un error al guardar la receta.',
                ephemeral: true,
            });
        }
    }
};
