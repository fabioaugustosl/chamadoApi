var express = require('express');

var ChamadoModel = require('../models/ChamadoModel');

var chamadoUtilRouter = express.Router();

var ChamadoController = require('../controller/ChamadoController')(ChamadoModel);



chamadoUtilRouter.route('/somatorioMinutos/:dono')
		.get(function(req, res){
			console.log('vai listar o somatorio de minutos');
			ChamadoController.listarMediaTemposChamados(req.params.dono, req, res);
		});

chamadoUtilRouter.route('/chamadosAbertos/:dono')
		.get(function(req, res){
			console.log('vai listar os chamados abertos');
			ChamadoController.listarChamadosAbertos(req.params.dono,null,req, res);
		});

chamadoUtilRouter.route('/chamadosAbertos/:dono/:idEmpresa')
		.get(function(req, res){
			console.log('vai listar os chamados abertos');
			ChamadoController.listarChamadosAbertos(req.params.dono,req.params.idEmpresa,req, res);
		});

chamadoUtilRouter.route('/chamadosDia/:dono/:data')
		.get(function(req, res){
			console.log('vai listar o total de chamados do dia');
			ChamadoController.listarTotaisChamadosDia(req.params.dono, req.params.data, req, res);
		});

chamadoUtilRouter.route('/qtdChamadosUltimos/:dono')
		.get(function(req, res){
			console.log('vai listar qtd de chamados dos ultimos dias');
			ChamadoController.listarResumoQtdChamadosUltimos(req.params.dono, req, res);
		});

chamadoUtilRouter.route('/mediaAvaliacaoAtendimento/:dono')
		.get(function(req, res){
			console.log('vai listar a media de avaliação dos atendimentos');
			ChamadoController.listarResumoMediaAvaliacoesChamados(req.params.dono, req, res);
		});

chamadoUtilRouter.route('/atendentesOcupadosPorRegiao/:idEmpresa')
		.get(function(req, res){
			console.log('vai listar os atendentes ocupados por região');
			ChamadoController.listarAtendentesOcupadosPorRegiao(req.params.idEmpresa, req, res);
		});
	
chamadoUtilRouter.route('/xls')
		.get(function(req, res){
			console.log('chegou no route de exportar XLS');
			ChamadoController.exportarChamado(req, res);
		});	


module.exports = chamadoUtilRouter;
