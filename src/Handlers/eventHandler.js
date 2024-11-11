const fs = require('node:fs');
const path = require('node:path');

async function cargarEvents(client) {
    const foldersPath = path.join(__dirname, '../Events');
    const eventFolders = fs.readdirSync(foldersPath);

    for (const folder of eventFolders) {
        const eventPath = path.join(foldersPath, folder);
        const eventFiles = fs.readdirSync(eventPath).filter(file => file.endsWith('.js'));

        for (const file of eventFiles) {
            const filePath = path.join(eventPath, file);
            const event = require(filePath);

            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args, client));
            } else {
                client.on(event.name, (...args) => event.execute(...args, client));
            }
        }
    }
}

module.exports = { cargarEvents };