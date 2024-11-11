const { Client, GatewayIntentBits, SlashCommandBuilder } = require('discord.js'); // Asegúrate de importar SlashCommandBuilder
const mongoose = require('mongoose');
const config = require('./config.json');
const { cargarCommands } = require('./Handlers/commandHandler');

// Crear el cliente de Discord
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// Conexión a MongoDB
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

// Evento 'ready' para el bot
client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);

  // Inicializamos el mapa de comandos
  client.commands = new Map();

  // Cargar los comandos
  await cargarCommands(client);
  
  console.log('Comandos cargados');
  
  // Registrar los comandos en Discord
  const { REST } = require('@discordjs/rest');
  const { Routes } = require('discord-api-types/v9');
  
  const commands = [
    new SlashCommandBuilder().setName('obtener_receta').setDescription('Consulta una receta por su nombre')
      .addStringOption(option => option.setName('nombre').setDescription('Nombre de la receta').setRequired(true)),
    new SlashCommandBuilder().setName('plantilla').setDescription('Plantilla de receta'),
    
    // Comando /new_receta para crear una nueva receta
    new SlashCommandBuilder()
      .setName('new_receta')
      .setDescription('Crea una nueva receta')
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

  ].map(command => command.toJSON());

  const rest = new REST({ version: '9' }).setToken(config.tokenbot);

  try {
    console.log('Registrando comandos...');
    await rest.put(Routes.applicationCommands(config.clientId), { body: commands });
    console.log('Comandos registrados correctamente.');
  } catch (error) {
    console.error('Error al registrar comandos:', error);
  }
});

// Manejo de interacciones
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

// Login con el token del bot
client.login(config.tokenbot);
