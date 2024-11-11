const { Client, ChatInputCommandInteraction } = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        if (!interaction.isCommand()) return;

        
        const command = client.commands.get(interaction.commandName);
       
        if (!command) {
            return interaction.reply({ content: `Hola ${interaction.user}, ese comando no está válido por el momento.`, ephemeral: true });
        }

        try {
  
            await command.execute(interaction, client);
        } catch (error) {
            console.error('Error al ejecutar el comando:', error);

            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
                    content: `Ocurrió un error al tratar de usar este comando.`,
                    ephemeral: true,
                });
            } else {
                await interaction.reply({
                    content: `Ocurrió un error al tratar de usar este comando.`,
                    ephemeral: true,
                });
            }
        }
    },
};

