var mongoose = require('mongoose'), Schema = mongoose.Schema;


var agrupamentoModel = new Schema({
	dono: {type:String ,lowercase: true, trim: true},
	idEmpresa: {type:String},
	nomeEmpresa: {type:String },
	nome: {type:String, trim: true},
	qtdAndares: {type:Number}
});

module.exports = mongoose.model('Agupamento', agrupamentoModel);