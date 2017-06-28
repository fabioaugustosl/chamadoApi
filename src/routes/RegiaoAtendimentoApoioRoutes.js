/*var express = require('express');

var regiaoRouter = express.Router();

var regiaoModel = require('../models/RegiaoAtendimentoApoioModel');
var regiaoController = require('../controller/RegiaoAtendimentoApoioController')(regiaoModel);


regiaoRouter.route('/')
		.post(function(req, res){
			regiaoController.salvarNovo(req, res);
		})
		.get(function(req, res){
			regiaoController.listar(req, res);
		});


regiaoRouter.use('/:regiaoId', function(req, res, next){
	console.log('chegou no middleware regiao route');
	
	// esse é nosso middleware
	regiaoModel.findById(req.params.regiaoId, function(err, regiao){
		if(err){
			res.status(500).send(err);
		} else if(regiao) {
			req.regiao = regiao;
			next();
		} else {
			res.status(404).send('regiao não encontrado');
		}
	});
});


regiaoRouter.route('/:regiaoId')
		.get(function(req, res){
			res.json(req.regiao);
		})
		.delete(function(req, res){
			regiaoController.remover(req, res);
		});

		

module.exports = regiaoRouter;
*/