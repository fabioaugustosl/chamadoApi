var mongoose = require('mongoose'), Schema = mongoose.Schema;


var empresaModel = new Schema({
	dono: {type:String},
	nomeEmpresa: {type:String},
	email: {type:String},
	telefone: {type:String},
	logradouro: {type:String},
	numero: {type:String},
	complemento: {type:String},
	bairro: {type:String},
	cidade: {type:String},
	estado: {type:String},
	nomeResponsavel: {type:String},
	emailResponsavel: {type:String},
	telefoneResponsavel: {type:String}
});

module.exports = mongoose.model('Empresa', empresaModel);