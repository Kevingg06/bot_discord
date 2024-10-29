const { Client, GatewayIntentBits } = require('discord.js');
const mongoose = require('mongoose');
const config = require('./config.json');
const { cargarCommands } = require('./Handlers/commandHandler');

mongoose.connect(config.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Conectado a la base de datos MongoDB');
})
.catch(err => {
  console.error('Error al conectar a la base de datos MongoDB:', err);
});

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  
  client.commands = new Map();

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
