var express = require('express');

var agrupamentoRouter = express.Router();

var AgrupamentoModel = require('../models/AgrupamentoModel');
var AgrupamentoController = require('../controller/AgrupamentoController')(AgrupamentoModel);


agrupamentoRouter.route('/')
		.post(function(req, res){
			AgrupamentoController.salvarNovo(req, res);
		})
		.get(function(req, res){
			AgrupamentoController.listar(req, res);
		});


agrupamentoRouter.use('/:agrupamentoId', function(req, res, next){
	console.log('chegou no middleware de agrupamento route');
	
	// esse é nosso middleware
	AgrupamentoModel.findById(req.params.agrupamentoId, function(err, chamado){
		if(err){
			res.status(500).send(err);
		} else if(chamado) {
			req.chamado = chamado;
			next();
		} else {
			res.status(404).send('Chamado não encontrado');
		}
	});
});


agrupamentoRouter.route('/:agrupamentoId')
		.get(function(req, res){
			res.json(req.chamado);
		})
		.patch(function(req, res){
			AgrupamentoController.atualizar(req, res);
		})
		.delete(function(req, res){
			AgrupamentoController.remover(req, res);
		});

		

module.exports = agrupamentoRouter;