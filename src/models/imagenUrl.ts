import mongoose, { Document, Model, Schema } from 'mongoose';

// Definimos la interfaz para los documentos de 'ImagenUrl'
export interface IImagenUrl extends Document {
    url: string;  // URL de la imagen (obligatorio)
    descripcion?: string;  // Descripción opcional de la imagen
}

// Definimos el esquema de 'ImagenUrl'
const imagenUrlSchema: Schema<IImagenUrl> = new Schema<IImagenUrl>({
    url: { type: String, required: true },  // Campo obligatorio para la URL
    descripcion: { type: String },  // Descripción opcional
});

// Creamos y exportamos el modelo 'ImagenUrl'
const ImagenUrl: Model<IImagenUrl> = mongoose.model<IImagenUrl>('ImagenUrl', imagenUrlSchema);

export default ImagenUrl;
