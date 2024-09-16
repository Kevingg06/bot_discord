import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IIngrediente extends Document {
  nombre: string;
  cantidad: string; // Ajusta el tipo según tus necesidades
}

const ingredienteSchema: Schema<IIngrediente> = new Schema({
  nombre: {
    type: String,
    required: true,
  },
  cantidad: {
    type: String,
    required: true,
  },
});

const Ingrediente: Model<IIngrediente> = mongoose.model<IIngrediente>('Ingrediente', ingredienteSchema);

export default Ingrediente;
