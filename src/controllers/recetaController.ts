import Receta from '../models/receta2.js'; 

export const obtenerRecetas = async () => {
  try {
    const recetas = await Receta.find().populate('ingredientes instrucciones');
    return recetas;
  } catch (error) {
    console.error('Error al obtener las recetas:', error);
    return [];
  }
};

export const obtenerRecetaPorNombre = async (nombre: string) => {
  try {
    const receta = await Receta.findOne({ nombre }).populate('ingredientes instrucciones');
    return receta;
  } catch (error) {
    console.error('Error al obtener la receta:', error);
    return null;
  }
};