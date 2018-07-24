var express = require('express');

var notificacaoRouter = express.Router();

var NotificacaoModel = require('../models/NotificacaoModel');
var NotificacaoController = require('../controller/NotificacaoController')(NotificacaoModel);


notificacaoRouter.route('/')
		.post(function(req, res){
			NotificacaoController.salvarNovo(req, res);
		})
		.get(function(req, res){
			NotificacaoController.listar(req, res);
		});

notificacaoRouter.route('/porChamado/:idChamado')
		.post(function(req, res){
			NotificacaoController.salvarPorChamado(req.params.idChamado, req, res);
		});


notificacaoRouter.route('/ler/:notificacaoId')
		.get(function(req, res){
			NotificacaoController.registrarLeituraNotificacao(req.params.notificacaoId, req, res);
		});


notificacaoRouter.route('/:notificacaoId')
		.get(function(req, res){
			NotificacaoModel.findById(req.params.notificacaoId, function(err, notificacao){
				if(err){
					res.status(500).send(err);
				} else if(notificacao) {
					res.json(notificacao);
				} else {
					res.status(404).send('notificacao não encontrada');
				}
			});
		})
		.delete(function(req, res){
			// esse é nosso middleware
			NotificacaoModel.findById(req.params.notificacaoId, function(err, notificacao){
				if(err){
					res.status(500).send(err);
				} else if(notificacao) {
					req.notificacao = notificacao;
					NotificacaoController.remover(req, res);
				} else {
					res.status(404).send('notificacao não encontrada');
				}
			});

			
		});

		

module.exports = notificacaoRouter;