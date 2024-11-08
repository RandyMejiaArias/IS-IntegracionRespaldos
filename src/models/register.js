import { Schema, model } from 'mongoose';

const registerSchema = new Schema({
  fecha: String,
  mesReporte: String,
  añoReporte: String,
  tipoRegistro: String,
  monto: String
});

export default model('Register', registerSchema);