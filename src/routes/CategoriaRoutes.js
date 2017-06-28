var express = require('express');

var categoriaRouter = express.Router();

var CategoriaAtendimentoModel = require('../models/CategoriaAtendimentoModel');
var CategoriaAtendimentoController = require('../controller/CategoriaAtendimentoController')(CategoriaAtendimentoModel);


categoriaRouter.route('/')
		.post(function(req, res){
			CategoriaAtendimentoController.salvarNovo(req, res);
		})
		.get(function(req, res){
			CategoriaAtendimentoController.listar(req, res);
		});


categoriaRouter.use('/:categoriaId', function(req, res, next){
	console.log('chegou no middleware categoria route');
	
	// esse é nosso middleware
	CategoriaAtendimentoModel.findById(req.params.categoriaId, function(err, categoria){
		if(err){
			res.status(500).send(err);
		} else if(categoria) {
			req.categoria = categoria;
			next();
		} else {
			res.status(404).send('Categoria não encontrada');
		}
	});
});


categoriaRouter.route('/:categoriaId')
		.get(function(req, res){
			res.json(req.categoria);
		})
		.patch(function(req, res){
			CategoriaAtendimentoController.atualizar(req, res);
		})
		.delete(function(req, res){
			CategoriaAtendimentoController.remover(req, res);
		});

		

module.exports = categoriaRouter;