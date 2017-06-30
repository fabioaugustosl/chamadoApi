var express = require('express');

var chamadoRouter = express.Router();

var classificadorStatus = require('../util/ClassificadorStatusChamado');
var chamadoModel = require('../models/ChamadoModel');
var regiaoModel = require('../models/RegiaoModel');
var chamadoController = require('../controller/ChamadoController')(chamadoModel,regiaoModel);


chamadoRouter.route('/')
		.post(function(req, res){
			chamadoController.salvarNovo(req, res);
		})
		.get(function(req, res){
			chamadoController.listar(req, res);
		});


chamadoRouter.use('/:chamadoId', function(req, res, next){
	console.log('chegou no middleware chamado route');
	
	// esse é nosso middleware
	chamadoModel.findById(req.params.chamadoId, function(err, chamado){
		if(err){
			res.status(500).send(err);
		} else if(chamado) {
			console.log('find by id route');
			req.chamado = chamado;
			
			console.log(req.chamado.status);

			
			next();
		} else {
			res.status(404).send('Chamado não encontrado');
		}
	});
});


chamadoRouter.route('/:chamadoId')
		.get(function(req, res){
			req.chamado.status = classificadorStatus(req.chamado);
			console.log(req.chamado);
			res.json(req.chamado);
		})
		.patch(function(req, res){
			chamadoController.atualizar(req, res);
		})
		.delete(function(req, res){
			chamadoController.remover(req, res);
		});

		

module.exports = chamadoRouter;
