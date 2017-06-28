var mongoose = require('mongoose'), Schema = mongoose.Schema;


var unidadeModel = new Schema({
	dono: {type:String,lowercase: true, trim: true},
	codigo: {type:String},
	idAgrupamento: {type:String},
	nome: {type:String},
	qrcodeImg : {type:String},
	andar: {type:Number}
});

module.exports = mongoose.model('Unidade', unidadeModel);