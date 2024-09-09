const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('./config.json');

const clientId = '1267455379084804198'; // Reemplaza con el ID de tu bot

const commands = [];
const commandsPath = path.join(__dirname, 'commands/public'); // Ajusta la ruta si es necesario
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// Cargar todos los comandos
for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  commands.push(command.data.toJSON());
}

// Crear una instancia de REST y establecer el token del bot
const rest = new REST({ version: '10' }).setToken(config.tokenbot);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    // Obtener la lista de servidores del bot
    const guilds = await rest.get(Routes.userGuilds());
    const guildId = guilds[0]?.id; // Tomar el primer servidor en el que el bot está

    if (!guildId) {
      console.error('No guild found.');
      return;
    }

    console.log(`Registering commands for guild ID: ${guildId}`);

    // Enviar los comandos a la API de Discord
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: commands,
    });

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error('Error refreshing application (/) commands:', error);
  }
})();
