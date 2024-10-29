import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IIngrediente extends Document {
    nombre: string;
}

const ingredienteSchema: Schema<IIngrediente> = new Schema({
    nombre: { type: String, required: true },
});

const Ingrediente: Model<IIngrediente> = mongoose.model<IIngrediente>('Ingrediente', ingredienteSchema);
export default Ingrediente;
