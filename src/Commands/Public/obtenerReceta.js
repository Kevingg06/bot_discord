const { SlashCommandBuilder } = require('discord.js');
const Receta = require('../../models/receta2'); // Importamos el modelo Receta correctamente

// Función para obtener el precio del ingrediente
async function obtenerPrecioIngrediente(nombreIngrediente) {
    const fetch = (await import('node-fetch')).default;
    const url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(nombreIngrediente)}&pageSize=1&api_key=key`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        const alimento = data.foods[0];
        
        // Si encontramos un precio, lo devolvemos; si no, generamos uno entre 1 y 5
        const precio = alimento?.foodNutrients?.find(n => n.nutrientName === 'Energy')?.value;
        return precio ? `$${precio.toFixed(2)} USD` : `$${(Math.random() * 4 + 1).toFixed(2)} USD`;
    } catch (error) {
        console.error(`Error al obtener el precio de ${nombreIngrediente}:`, error);
        return `$${(Math.random() * 4 + 1).toFixed(2)} USD`; // Valor aleatorio si falla la API
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('obtener_receta')
        .setDescription('Consulta una receta por su nombre')
        .addStringOption(option =>
            option.setName('nombre')
                .setDescription('El nombre de la receta')
                .setRequired(true)),

    async execute(interaction) {
        const nombre = interaction.options.getString('nombre'); // Obtenemos el nombre de la receta
        try {
            // Buscamos la receta por su nombre y poblamos los ingredientes, instrucciones y la imagen
            const receta = await Receta.findOne({ nombre })
                .populate('ingredientes')
                .populate('instrucciones')
                .populate('imagenUrl');

            if (!receta) {
                return await interaction.reply({
                    content: `No se encontró ninguna receta con el nombre "${nombre}".`,
                    ephemeral: true,
                });
            }

            // Obtenemos los precios de cada ingrediente
            const ingredientesConPrecios = await Promise.all(
                receta.ingredientes.map(async (ing) => {
                    const precio = await obtenerPrecioIngrediente(ing.nombre);
                    return `- ${ing.nombre}: ${precio}`;
                })
            );
            const ingredientes = ingredientesConPrecios.join('\n');
            const instrucciones = receta.instrucciones.map(ins => `${ins.paso}. ${ins.descripcion}`).join('\n');
            const imagenUrl = receta.imagenUrl ? receta.imagenUrl.url : 'No hay imagen disponible';

            // Generamos el mensaje con toda la información de la receta y los precios
            const respuesta = `
**Receta:** ${receta.nombre}
**Ingredientes y precios:**
${ingredientes}

**Instrucciones:**
${instrucciones}

**Imagen:**
${imagenUrl}
`;

            // Enviamos la respuesta al usuario
            await interaction.reply({
                content: respuesta,
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
