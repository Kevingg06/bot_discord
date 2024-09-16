import mongoose, { Document, Model, Schema } from 'mongoose';
import { IIngrediente } from './ingrediente'; // Asegúrate de ajustar la ruta
import { IInstruccion } from './instruccion'; // Asegúrate de ajustar la ruta

interface IReceta extends Document {
  nombre: string;
  ingredientes: IIngrediente['_id'][]; // Referencias a los documentos de Ingredientes
  instrucciones: IInstruccion['_id'][]; // Referencias a los documentos de Instrucciones
}

const recetaSchema: Schema<IReceta> = new Schema({
  nombre: {
    type: String,
    required: true,
  },
  ingredientes: [{
    type: Schema.Types.ObjectId,
    ref: 'Ingrediente',
  }],
  instrucciones: [{
    type: Schema.Types.ObjectId,
    ref: 'Instruccion',
  }],
});

const Receta: Model<IReceta> = mongoose.model<IReceta>('Receta', recetaSchema);

export default Receta;
