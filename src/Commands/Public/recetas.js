const { SlashCommandBuilder, ChatInputCommandInteraction, Client } = require('discord.js');
const Receta = require('../../models/receta2'); // Ajusta la ruta según la estructura de tu proyecto

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
                .setDescription('Ingredientes de la receta')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('instrucciones')
                .setDescription('Instrucciones de la receta')
                .setRequired(true)),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const nombre = interaction.options.getString('nombre');
        const ingredientes = interaction.options.getString('ingredientes');
        const instrucciones = interaction.options.getString('instrucciones');

        try {
            const nuevaReceta = new Receta({
                nombre: nombre.trim(),
                ingredientes: ingredientes.trim(),
                instrucciones: instrucciones.trim(),
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