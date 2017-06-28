var express = require('express');

var itemRouter = express.Router();

var ItemAtendimentoModel = require('../models/ItemAtendimentoModel');
var ItemAtendimentoController = require('../controller/ItemAtendimentoController')(ItemAtendimentoModel);


itemRouter.route('/')
		.post(function(req, res){
			ItemAtendimentoController.salvarNovo(req, res);
		})
		.get(function(req, res){
			ItemAtendimentoController.listar(req, res);
		});


itemRouter.use('/:itemId', function(req, res, next){
	console.log('chegou no middleware item route');
	
	// esse é nosso middleware
	ItemAtendimentoModel.findById(req.params.itemId, function(err, item){
		if(err){
			res.status(500).send(err);
		} else if(item) {
			req.item = item;
			next();
		} else {
			res.status(404).send('Item não encontrada');
		}
	});
});


itemRouter.route('/:itemId')
		.get(function(req, res){
			res.json(req.item);
		})
		.patch(function(req, res){
			ItemAtendimentoController.atualizar(req, res);
		})
		.delete(function(req, res){
			ItemAtendimentoController.remover(req, res);
		});

		

module.exports = itemRouter;