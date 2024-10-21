import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IInstruccion extends Document {
  paso: number;
  descripcion: string;
}

const instruccionSchema: Schema<IInstruccion> = new Schema({
  paso: {
    type: Number,
    required: true,
  },
  descripcion: {
    type: String,
    required: true,
  },
});

const Instruccion: Model<IInstruccion> = mongoose.model<IInstruccion>('Instruccion', instruccionSchema);

export default Instruccion;
