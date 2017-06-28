var express = require('express');

var paramentoRouter = express.Router();

var ParamentoGeralModel = require('../models/ParametroGeralModel');
var ParametroGeralController = require('../controller/ParametroGeralController')(ParamentoGeralModel);


paramentoRouter.route('/')
		.post(function(req, res){
			ParametroGeralController.salvarNovo(req, res);
		})
		.get(function(req, res){
			ParametroGeralController.listar(req, res);
		});


paramentoRouter.use('/:paramentoId', function(req, res, next){
	console.log('chegou no middleware de parametro route');
	
	// esse é nosso middleware
	ParamentoGeralModel.findById(req.params.paramentoId, function(err, chamado){
		if(err){
			res.status(500).send(err);
		} else if(chamado) {
			req.chamado = chamado;
			next();
		} else {
			res.status(404).send('Parametro não encontrado');
		}
	});
});


paramentoRouter.route('/:paramentoId')
		.get(function(req, res){
			res.json(req.chamado);
		})
		.patch(function(req, res){
			ParametroGeralController.atualizar(req, res);
		})
		.delete(function(req, res){
			ParametroGeralController.remover(req, res);
		});

		

module.exports = paramentoRouter;