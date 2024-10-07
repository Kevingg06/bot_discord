import mongoose, { Document, Model, Schema } from 'mongoose';
import { IIngrediente } from './ingrediente';
import { IInstruccion } from './instruccion';

interface IReceta extends Document {
  nombre: string;
  ingredientes: IIngrediente['_id'][]; 
  instrucciones: IInstruccion['_id'][]; 
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

