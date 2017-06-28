var mongoose = require('mongoose'), Schema = mongoose.Schema;

var itemAtendimentoModel = new Schema({ 
	dono: {type:String,lowercase: true, trim: true},
	codigo: {type:String},
	nome: {type:String,trim: true}
});

module.exports = mongoose.model('ItemAtendimento', itemAtendimentoModel);