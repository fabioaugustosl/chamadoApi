var mongoose = require('mongoose'), Schema = mongoose.Schema;


var apoioModel = new Schema({
	dono: {type:String,lowercase: true, trim: true},
	idEmpresa: {type:String},
	nome: {type:String},
	sexo: {type:String},
	email: {type:String},
	telefone: {type:String},
	linkImagem: {type:String},
	codigo: {type:String}
});

module.exports = mongoose.model('Apoio', apoioModel);