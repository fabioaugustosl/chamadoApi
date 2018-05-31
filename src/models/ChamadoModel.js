var mongoose = require('mongoose'), 
				//Item = require('./ItemAtendimentoModel.js'),
				//ItemSchema = mongoose.model('ItemAtendimentoModel').schema,
				Schema = mongoose.Schema;

//var Item = require('/src/models/ItemAtendimentoModel.js');
//var itemAtendimentoModel = require('mongoose').model('ItemAtendimentoModel').schema;

var chamadoModel = new Schema({
	dono: {type:String,lowercase: true, trim: true},
	codigo: {type:String},
	idEmpresa: {type:String},
	idRegiao: {type:String},
	nomeRegiao: {type:String},
	idSolicitante: {type:String},
	nomeSolicitante: {type:String},
	cpfSolicitante: {type:String},
	idAtendente: {type:String},
	nomeAtendente: {type:String},
	idUnidade: {type: Schema.Types.ObjectId, ref:'Unidade'},
	nomeUnidade: {type:String},
	idCategoria: {type:String},
	nomeCategoria: {type:String},
	previsaoChegada : {type:Number},
	itens: [{type: Schema.Types.ObjectId, ref:'ItemAtendimento'}],
	dataCriacao:{ type: Date, default: Date.now},
	dataApoio:{ type: Date},
	dataInicioAtendimento:{ type: Date},
	dataFim:{ type: Date},
	comentarioEncerramento: {type:String},
	deletado:{type:Boolean, default: false},
	minutosAteAtribuicao:{type: Number},
	minutosDaAtribuicaoAteInicio:{type: Number},
	minutosDoInicioAteFinalizacao:{type: Number},
	avaliacaoAtendimento:{type: Number},
	status:{type:String}
});

module.exports = mongoose.model('Chamado', chamadoModel);