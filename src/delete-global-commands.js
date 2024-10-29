const { REST, Routes } = require('discord.js');
const { clientId, tokenbot } = require('./config.json');

const rest = new REST({ version: '10' }).setToken(tokenbot);

(async () => {
  try {
    console.log('Fetching global application commands...');

  
    const commands = await rest.get(Routes.applicationCommands(clientId));

    console.log(`Found ${commands.length} global application commands.`);

    for (const command of commands) {
      console.log(`Deleting command with ID ${command.id}...`);
      

      await rest.delete(Routes.applicationCommand(clientId, command.id));
    }

    console.log('Successfully deleted all global application commands.');
  } catch (error) {
    console.error('Error deleting global application commands:', error);
  }
})();
