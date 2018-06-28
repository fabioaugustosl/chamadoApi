var express = require('express');

var ChamadoModel = require('../models/ChamadoModel');

var chamadoUtilRouter = express.Router();

var ChamadoController = require('../controller/ChamadoController')(ChamadoModel);




chamadoUtilRouter.route('/pegar/:idChamado/:idAtendente/:nomeAtendente/:previsaoEmMinutos')
		.post(function(req, res){
			console.log('chegou no iniciar atendimento');
			ChamadoController.pegarAtendimento(req.params.idChamado,req.params.idAtendente,req.params.nomeAtendente, req.params.previsaoEmMinutos, req, res);
		});

chamadoUtilRouter.route('/iniciar/:idChamado/:idAtendente')
		.post(function(req, res){
			console.log('chegou no iniciar atendimento');
			ChamadoController.iniciarAtendimento(req.params.idChamado,req.params.idAtendente, req, res);
		});

chamadoUtilRouter.route('/finalizar/:idChamado')
		.post(function(req, res){
			console.log('chegou no finalizar atendimento');
			ChamadoController.finalizarAtendimento(req.params.idChamado, req, res);
		});

chamadoUtilRouter.route('/classificar/:idChamado')
		.post(function(req, res){
			console.log('chegou no classificar atendimento');
			ChamadoController.classificarAtendimento(req.params.idChamado, req, res);
		});

chamadoUtilRouter.route('/avaliar/:idChamado/:numeroEstrelas')
		.get(function(req, res){
			console.log('chegou no avaliar atendimento');
			ChamadoController.avaliarAtendimento(req.params.idChamado, req.params.numeroEstrelas, req, res);
		});

chamadoUtilRouter.route('/remover/:idChamado')
		.delete(function(req, res){
			console.log('chegou no remover logico');
			ChamadoController.removerLogico(req.params.idChamado, req, res);
		});

chamadoUtilRouter.route('/abertos/:idSolicitante')
		.get(function(req, res){
			console.log('chegou listar chamados aberto por solicitantes : ',req.params.idSolicitante);
			ChamadoController.listarChamadosPorSolicitante(req.params.idSolicitante, 1, req, res);
		});

chamadoUtilRouter.route('/fechados/:idSolicitante')
		.get(function(req, res){
			console.log('chegou listar chamados fechados por solicitantes');
			ChamadoController.listarChamadosPorSolicitante(req.params.idSolicitante, 0, req, res);
		});

chamadoUtilRouter.route('/abertosPorRegiao/:idAtendente')
		.get(function(req, res){
			console.log('chegou listar chamados abertoa por regiao do atendente');
			ChamadoController.listarChamadosAbertosPorRegiaoDoAtendente(req.params.idAtendente,req, res);
		});

chamadoUtilRouter.route('/emAtendimento/:idAtendente')
		.get(function(req, res){
			console.log('chegou listar chamado em atendimento de um atendente');
			ChamadoController.listarChamadoEmAtendimento(req.params.idAtendente,req, res);
		});





module.exports = chamadoUtilRouter;
