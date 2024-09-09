const { REST, Routes } = require('discord.js');
const { clientId, tokenbot } = require('../config.json');
const fs = require('node:fs');
const path = require('node:path');

async function cargarCommands(client) {
    const commands = [];
    const foldersPath = path.join(__dirname, '../Commands');

    if (!fs.existsSync(foldersPath)) {
        console.error(`El directorio de comandos no existe: ${foldersPath}`);
        return;
    }

    const commandFolders = fs.readdirSync(foldersPath);

    for (const folder of commandFolders) {
        const commandPath = path.join(foldersPath, folder);
        if (!fs.existsSync(commandPath)) {
            console.error(`El directorio de comandos ${commandPath} no existe`);
            continue;
        }

        const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith(".js"));
        for (const file of commandFiles) {
            const filePath = path.join(commandPath, file);
            const command = require(filePath);

            if ('data' in command && 'execute' in command) {
                client.commands.set(command.data.name, command); // Asegúrate de agregar el comando a la colección
                commands.push(command.data.toJSON());
            } else {
                console.log(`[WARNING] The command at ${filePath} is missing a required 'data' or 'execute' property.`);
            }
        }
    }

    const rest = new REST().setToken(tokenbot);

    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);
        const data = await rest.put(Routes.applicationCommands(clientId), {
            body: commands,
        });
        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error('Error reloading application (/) commands:', error);
    }
}

module.exports = { cargarCommands };

