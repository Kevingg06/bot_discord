const { SlashCommandBuilder } = require('discord.js');

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
                .setDescription('Instrucciones de la receta (separadas por punto y coma)')
                .setRequired(true)),

    async execute(interaction, client) {
        const nombre = interaction.options.getString('nombre');
        const ingredientesString = interaction.options.getString('ingredientes');
        const instruccionesString = interaction.options.getString('instrucciones');

        try {
     
            const Receta = (await import('../../models/receta2.mjs')).default;
            const Ingrediente = (await import('../../models/ingrediente.mjs')).default;
            const Instruccion = (await import('../../models/instruccion.mjs')).default;

      
            const ingredientesArray = ingredientesString.split(',').map(i => i.trim());
            const ingredientesIds = await Promise.all(ingredientesArray.map(async (nombre) => {
                const nuevoIngrediente = new Ingrediente({ nombre });
                const savedIngrediente = await nuevoIngrediente.save();
                return savedIngrediente._id;
            }));

           
            const instruccionesArray = instruccionesString.split(';').map(i => i.trim());
            const instruccionesIds = await Promise.all(instruccionesArray.map(async (instruccion, index) => {
                if (!instruccion) {
                    console.error(`Instrucción vacía en el paso ${index + 1}`);
                    return null; 
                }
                const nuevaInstruccion = new Instruccion({
                    paso: index + 1,
                    descripcion: instruccion
                });
                const savedInstruccion = await nuevaInstruccion.save();
                return savedInstruccion._id;
            }));


            const filteredInstruccionesIds = instruccionesIds.filter(id => id !== null);

    
            const nuevaReceta = new Receta({
                nombre: nombre.trim(),
                ingredientes: ingredientesIds,
                instrucciones: filteredInstruccionesIds,
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
