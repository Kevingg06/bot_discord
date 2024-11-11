const { SlashCommandBuilder } = require('discord.js');
const Receta = require('../../models/receta2');
const Ingrediente = require('../../models/ingrediente.js').default;
const Instruccion = require('../../models/instruccion.js').default;
const ImagenUrl = require('../../models/imagenUrl.js').default; // Importamos el modelo ImagenUrl

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
                .setRequired(true))
        .addStringOption(option => 
            option.setName('imagenurl')
                .setDescription('URL de la imagen de la receta')
                .setRequired(true)), // Campo obligatorio para la imagen de la receta

    async execute(interaction) {
        const nombre = interaction.options.getString('nombre');
        const ingredientesInput = interaction.options.getString('ingredientes').split(',').map(ing => ing.trim());
        const instruccionesInput = interaction.options.getString('instrucciones').split('\n').map(ins => ins.trim());
        const imagenUrlInput = interaction.options.getString('imagenurl'); // Obtener la URL de la imagen

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

            // Crear y guardar la URL de la imagen
            const nuevaImagenUrl = new ImagenUrl({
                url: imagenUrlInput.trim(), // Guardar la URL de la imagen
                descripcion: 'Imagen de la receta', // Descripción opcional de la imagen
            });

            const imagenUrlGuardada = await nuevaImagenUrl.save();

            // Crear y guardar la receta con la imagen asociada
            const nuevaReceta = new Receta({
                nombre: nombre.trim(),
                ingredientes: ingredientesIds,
                instrucciones: instruccionesIds,
                imagenUrl: imagenUrlGuardada._id, // Asociamos la imagen con la receta
            });

            await nuevaReceta.save();

            // Responder al usuario
            await interaction.reply({
                content: `Receta '${nombre.trim()}' guardada exitosamente con la imagen.`,
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