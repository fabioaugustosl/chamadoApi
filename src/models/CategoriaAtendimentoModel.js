var mongoose = require('mongoose'), Schema = mongoose.Schema;

var categoriaModel = new Schema({
	dono: {type:String,lowercase: true, trim: true},
	codigo: {type:String},
	nome: {type:String,lowercase: true, trim: true},
	empresas: [{type: Schema.Types.ObjectId, ref:'Empresa'}],
	itens: [{type: Schema.Types.ObjectId, ref:'ItemAtendimento'}]
});

module.exports = mongoose.model('CategoriaAtendimento', categoriaModel);