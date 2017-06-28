var express = require('express');

var unidadeRouter = express.Router();

var UnidadeModel = require('../models/UnidadeModel');
var UnidadeController = require('../controller/UnidadeController')(UnidadeModel);


unidadeRouter.route('/')
		.post(function(req, res){
			UnidadeController.salvarNovo(req, res);
		})
		.get(function(req, res){
			UnidadeController.listar(req, res);
		});


unidadeRouter.use('/:unidadeId', function(req, res, next){
	console.log('chegou no middleware de unidade route');
	
	// esse é nosso middleware
	UnidadeModel.findById(req.params.unidadeId, function(err, chamado){
		if(err){
			res.status(500).send(err);
		} else if(chamado) {
			req.chamado = chamado;
			next();
		} else {
			res.status(404).send('Unidade não encontrado');
		}
	});
});


unidadeRouter.route('/:unidadeId')
		.get(function(req, res){
			res.json(req.chamado);
		})
		.patch(function(req, res){
			UnidadeController.atualizar(req, res);
		})
		.delete(function(req, res){
			UnidadeController.remover(req, res);
		});

		

module.exports = unidadeRouter;