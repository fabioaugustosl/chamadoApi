var express = require('express');

var empresaRouter = express.Router();

var empresaModel = require('../models/EmpresaModel');
var empresaController = require('../controller/EmpresaController')(empresaModel);


empresaRouter.route('/')
		.post(function(req, res){
			empresaController.salvarNovo(req, res);
		})
		.get(function(req, res){
			empresaController.listar(req, res);
		});


empresaRouter.use('/:empresaId', function(req, res, next){
	console.log('chegou no middleware empresa route');
	
	// esse é nosso middleware
	empresaModel.findById(req.params.empresaId, function(err, empresa){
		if(err){
			res.status(500).send(err);
		} else if(empresa) {
			req.empresa = empresa;
			next();
		} else {
			res.status(404).send('empresa não encontrado');
		}
	});
});


empresaRouter.route('/:empresaId')
		.get(function(req, res){
			res.json(req.empresa);
		})
		.patch(function(req, res){
			eventoController.atualizar(req, res);
		})
		.delete(function(req, res){
			empresaController.remover(req, res);
		});

		

module.exports = empresaRouter;
