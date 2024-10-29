const { SlashCommandBuilder } = require('discord.js');
const Receta = require('../../models/receta2.js').default; 

module.exports = {
    data: new SlashCommandBuilder()
        .setName('obtener_receta')
        .setDescription('Consulta una receta por su nombre')
        .addStringOption(option => 
            option.setName('nombre')
                .setDescription('El nombre de la receta')
                .setRequired(true)),
    
    async execute(interaction) {
        const nombre = interaction.options.getString('nombre');
        try {
            const receta = await Receta.findOne({ nombre }).populate('ingredientes').populate('instrucciones');
            if (!receta) {
                return await interaction.reply({
                    content: `No se encontró ninguna receta con el nombre "${nombre}".`,
                    ephemeral: true,
                });
            }
            const ingredientes = receta.ingredientes.map(ing => ing.nombre).join(', '); 
            const instrucciones = receta.instrucciones.map(ins => `${ins.paso}. ${ins.descripcion}`).join('\n'); 
            await interaction.reply({
                content: `**Receta:** ${receta.nombre}\n**Ingredientes:** ${ingredientes}\n**Instrucciones:** ${instrucciones}`,
                ephemeral: true,
            });
        } catch (error) {
            console.error('Error al consultar la receta:', error);
            await interaction.reply({
                content: 'Hubo un error al consultar la receta. Por favor intenta de nuevo.',
                ephemeral: true,
            });
        }
    },
};
