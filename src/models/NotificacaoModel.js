var mongoose = require('mongoose'), Schema = mongoose.Schema;


var notificacaoModel = new Schema({
	dono: {type:String,lowercase: true, trim: true},
	idPessoa: {type:String},
	msg: {type:String},
	tipo: {type:String},
	idChamado: {type:String},
	lido: {type:Boolean},
	dataCriacao:{ type: Date},
	dataLeitura:{ type: Date},
});

module.exports = mongoose.model('Notificacao', notificacaoModel);