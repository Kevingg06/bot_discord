import { SlashCommandBuilder, ChatInputCommandInteraction, Client } from 'discord.js';
import Ingrediente from '../../models/ingrediente'; // Ajusta la ruta
import Instruccion from '../../models/instruccion'; // Ajusta la ruta
import Receta from '../../models/receta'; // Ajusta la ruta

export default {
    data: new SlashCommandBuilder()
        .setName('receta')
        .setDescription('Añade una receta.')
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
                .setDescription('Instrucciones de la receta (separadas por punto y coma)')
                .setRequired(true)),

    /**
     * Ejecuta el comando en la interacción de chat.
     * 
     * @param {ChatInputCommandInteraction} interaction - La interacción de comando de entrada de chat.
     * @param {Client<boolean>} client - El cliente de Discord.
     */
    async execute(interaction: ChatInputCommandInteraction, client: Client<boolean>): Promise<void> {
        const nombre = interaction.options.getString('nombre');
        const ingredientesString = interaction.options.getString('ingredientes');
        const instruccionesString = interaction.options.getString('instrucciones');

        if (!nombre || !ingredientesString || !instruccionesString) {
            await interaction.reply({
                content: 'Faltan parámetros para guardar la receta.',
                ephemeral: true,
            });
            return;
        }

        try {
            const ingredientes = ingredientesString.split(',').map(ingrediente => {
                return new Ingrediente({
                    nombre: ingrediente.trim(),
                    cantidad: 'N/A', // Ajusta según tus necesidades
                });
            });

            const instrucciones = instruccionesString.split(';').map((descripcion, index) => {
                return new Instruccion({
                    paso: index + 1,
                    descripcion: descripcion.trim(),
                });
            });

            // Guardar ingredientes e instrucciones en la base de datos
            const ingredientesSaved = await Promise.all(ingredientes.map(ingrediente => ingrediente.save()));
            const instruccionesSaved = await Promise.all(instrucciones.map(instruccion => instruccion.save()));

            const nuevaReceta = new Receta({
                nombre: nombre.trim(),
                ingredientes: ingredientesSaved.map(ingrediente => ingrediente._id),
                instrucciones: instruccionesSaved.map(instruccion => instruccion._id),
            });

            await nuevaReceta.save();

            await interaction.reply({
                content: `Receta '${nombre.trim()}' guardada exitosamente.`,
                ephemeral: true,
            });
        } catch (error) {
            console.error('Error guardando la receta:', error);
            await interaction.reply({
                content: 'Hubo un error al guardar la receta.',
                ephemeral: true,
            });
        }
    }
};
