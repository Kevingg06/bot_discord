const { SlashCommandBuilder } = require('discord.js');
const Receta = require('../../models/receta2'); // Importamos el modelo Receta correctamente

module.exports = {
    data: new SlashCommandBuilder()
        .setName('obtener_receta')
        .setDescription('Consulta una receta por su nombre')
        .addStringOption(option =>
            option.setName('nombre')
                .setDescription('El nombre de la receta')
                .setRequired(true)),

    async execute(interaction) {
        const nombre = interaction.options.getString('nombre');  // Obtenemos el nombre de la receta
        try {
            // Buscamos la receta por su nombre y poblamos los ingredientes, instrucciones y la imagen
            const receta = await Receta.findOne({ nombre })
                .populate('ingredientes')    // Poblamos los ingredientes
                .populate('instrucciones')  // Poblamos las instrucciones
                .populate('imagenUrl');      // Poblamos la URL de la imagen (si existe)

            if (!receta) {
                return await interaction.reply({
                    content: `No se encontró ninguna receta con el nombre "${nombre}".`,  // Si no encontramos la receta
                    ephemeral: true,
                });
            }

            // Procesamos los ingredientes, instrucciones y otros campos para mostrarlos
            const ingredientes = receta.ingredientes.map(ing => `- ${ing.nombre}`).join('\n');
            const instrucciones = receta.instrucciones.map(ins => `${ins.paso}. ${ins.descripcion}`).join('\n');
            const imagenUrl = receta.imagenUrl ? receta.imagenUrl.url : 'No hay imagen disponible';  // Si la receta tiene una URL de imagen

            // Generamos el mensaje con toda la información de la receta
            const respuesta = `
**Receta:** ${receta.nombre}
**Ingredientes:**
${ingredientes}

**Instrucciones:**
${instrucciones}

**Imagen:**
${imagenUrl}
`;

            // Enviamos la respuesta al usuario
            await interaction.reply({
                content: respuesta,
                ephemeral: true,  // La respuesta será solo visible para el usuario que hizo la consulta
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
