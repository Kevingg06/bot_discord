const { REST, Routes, SlashCommandBuilder } = require('discord.js');
const { tokenbot, clientId } = require('./config.json'); // Asegúrate de tener el token del bot y el clientId en tu config.json

// Definir los comandos (en caso de que quieras agregar más comandos o registrarlos aquí)
const commands = [
    new SlashCommandBuilder().setName('new_receta').setDescription('Añade una receta.')
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
                .setRequired(true)),
];

const rest = new REST({ version: '10' }).setToken(tokenbot);

(async () => {
    try {
        console.log('Registrando comandos...');

        // Registro de los comandos en Discord (globales)
        await rest.put(
            Routes.applicationCommands(clientId), // Registrar comandos globales
            { body: commands.map(command => command.toJSON()) }
        );

        console.log('Comandos registrados correctamente.');
    } catch (error) {
        console.error('Error al registrar los comandos:', error);
    }
})();
