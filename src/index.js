const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const config = require('./config.json');

const { cargarEvents } = require('./Handlers/eventHandler');
const { cargarCommands } = require('./Handlers/commandHandler');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        // Agrega otros intents necesarios aquí
    ],
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.Reaction,
        // Agrega otros partials necesarios aquí
    ],
});

client.setMaxListeners(0);
client.commands = new Collection();

client.login(config.tokenbot).then(async () => {
    await cargarEvents(client);
    await cargarCommands(client);
}).catch((err) => {
    console.error('Error al iniciar sesión:', err);
});
