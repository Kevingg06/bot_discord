// src/index.js
const { Client, GatewayIntentBits } = require('discord.js');
const mongoose = require('mongoose');
const config = require('./config.json');
const connectDB = require('./db'); // Asegúrate de importar la función de conexión
const { cargarCommands } = require('./handlers/commandHandler');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const startBot = async () => {
    await connectDB(); // Conecta a la base de datos antes de iniciar el bot

    client.once('ready', async () => {
        console.log(`Logged in as ${client.user.tag}!`);
        
        // Configura la colección de comandos
        client.commands = new Map();
        
        // Cargar comandos
        await cargarCommands(client);
        
        console.log('Comandos cargados');
    });

    client.on('interactionCreate', async interaction => {
        if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName);

        if (!command) return;

        try {
            await command.execute(interaction, client);
        } catch (error) {
            console.error('Error ejecutando el comando:', error);
            await interaction.reply('Hubo un error al ejecutar este comando.');
        }
    });

    client.login(config.tokenbot);
};

startBot();
