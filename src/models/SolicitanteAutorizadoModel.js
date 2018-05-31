var mongoose = require('mongoose'), Schema = mongoose.Schema;


var autorizadoModel = new Schema({
	dono: {type:String ,lowercase: true, trim: true},
	celular: {type:String},
	cpf: {type:String },
	email: {type:String },
	nome: {type:String, trim: true}
});

module.exports = mongoose.model('SolicitanteAutorizado', autorizadoModel);