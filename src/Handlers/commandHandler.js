
const fs = require('fs');
const path = require('path');

async function cargarCommands(client) {
    const commandsPath = path.join(__dirname, '../Commands/Public');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        client.commands.set(command.data.name, command);
    }
}

module.exports = { cargarCommands };
