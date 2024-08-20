const { SlashCommandBuilder, ChatInputCommandInteraction, Client } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('plantilla')
        .setDescription('Prueba'),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        try {
            await interaction.reply({
                content: `Hola ${interaction.user}.`,
                ephemeral: true,
            });
        } catch (error) {
            console.error('Error en el comando plantilla:', error);
            await interaction.reply({
                content: 'Hubo un error al ejecutar el comando.',
                ephemeral: true,
            });
        }
    }
};
