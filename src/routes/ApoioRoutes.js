var express = require('express');

var apoioRouter = express.Router();

var ApoioModel = require('../models/ApoioModel');
var ApoioController = require('../controller/ApoioController')(ApoioModel);


apoioRouter.route('/')
		.post(function(req, res){
			ApoioController.salvarNovo(req, res);
		})
		.get(function(req, res){
			ApoioController.listar(req, res);
		});


apoioRouter.use('/:apoioId', function(req, res, next){
	console.log('chegou no middleware apoio route');
	
	// esse é nosso middleware
	ApoioModel.findById(req.params.apoioId, function(err, apoio){
		if(err){
			res.status(500).send(err);
		} else if(apoio) {
			req.apoio = apoio;
			next();
		} else {
			res.status(404).send('apoio não encontrada');
		}
	});
});


apoioRouter.route('/:apoioId')
		.get(function(req, res){
			res.json(req.apoio);
		})
		.patch(function(req, res){
			ApoioController.atualizar(req, res);
		})
		.delete(function(req, res){
			ApoioController.remover(req, res);
		});

		

module.exports = apoioRouter;