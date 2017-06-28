var mongoose = require('mongoose'), Schema = mongoose.Schema;


var parametroModel = new Schema({
	dono: {type:String ,lowercase: true, trim: true},
	idEmpresa: {type:String},
	nomeAgrupamento: {type:String},
	nomeUnidade: {type:String},
	nomeAtendente: {type:String},
	nomeSolicitante: {type:String}
});

module.exports = mongoose.model('ParametroGeral', parametroModel);