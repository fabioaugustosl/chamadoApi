var mongoose = require('mongoose'), Schema = mongoose.Schema;

var regiaoModel = new Schema({
	dono: {type:String,lowercase: true, trim: true},
	empresa: {type: Schema.Types.ObjectId, ref:'Empresa'},
	nome: {type:String},
	idRegiaoBackup : {type:String},
	unidades: [{type: Schema.Types.ObjectId, ref:'Unidade'}],
	apoios: [{type: Schema.Types.ObjectId, ref:'Apoio'}]
});

module.exports = mongoose.model('Regiao', regiaoModel);