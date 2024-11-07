import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IImagenUrl extends Document {
    url: string;  // URL de la imagen
    descripcion?: string;  // Descripción opcional de la imagen
}

const imagenUrlSchema: Schema<IImagenUrl> = new Schema({
    url: { type: String, required: true },  // Campo obligatorio para la URL
    descripcion: { type: String },  // Descripción opcional
});

const ImagenUrl: Model<IImagenUrl> = mongoose.model<IImagenUrl>('ImagenUrl', imagenUrlSchema);

export default ImagenUrl;
