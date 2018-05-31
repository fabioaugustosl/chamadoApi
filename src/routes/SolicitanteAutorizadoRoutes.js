var express = require('express');

var autorizadoRouter = express.Router();

var autorizadoModel = require('../models/SolicitanteAutorizadoModel');
var autorizadoController = require('../controller/SolicitanteAutorizadoController')(autorizadoModel);


autorizadoRouter.route('/')
		.post(function(req, res){
			autorizadoController.salvarNovo(req, res);
		})
		.get(function(req, res){
			autorizadoController.listar(req, res);
		});


autorizadoRouter.use('/:autorizadoId', function(req, res, next){
	console.log('chegou no middleware de solicitante autorizado route');
	
	// esse é nosso middleware
	autorizadoModel.findById(req.params.autorizadoId, function(err, autorizado){
		if(err){
			res.status(500).send(err);
		} else if(autorizado) {
			req.autorizado = autorizado;
			next();
		} else {
			res.status(404).send('autorizado não encontrado');
		}
	});
});


autorizadoRouter.route('/:autorizadoId')
		.get(function(req, res){
			res.json(req.autorizado);
		})
		.patch(function(req, res){
			autorizadoController.atualizar(req, res);
		})
		.delete(function(req, res){
			autorizadoController.remover(req, res);
		});

		

module.exports = autorizadoRouter;