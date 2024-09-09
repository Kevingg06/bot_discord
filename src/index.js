const { Client, GatewayIntentBits } = require('discord.js');
const mongoose = require('mongoose');
const config = require('./config.json');
const { cargarCommands } = require('./handlers/commandHandler'); // Importa correctamente la función

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);

  // Configura la colección de comandos
  client.commands = new Map();
  
  // Cargar comandos
  await cargarCommands(client);
  
  // Confirmar que los comandos se han cargado correctamente
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
