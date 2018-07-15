var express = require('express');

var ChamadoModel = require('../models/ChamadoModel');

var chamadoUtilRouter = express.Router();

var ChamadoController = require('../controller/ChamadoController')(ChamadoModel);

var ChamadoRelatorioController = require('../controller/ChamadoRelatorioController')(ChamadoModel);


// listagens
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


// relatórios e dashboards
chamadoUtilRouter.route('/somatorioMinutos/:dono')
		.get(function(req, res){
			console.log('vai listar o somatorio de minutos');
			ChamadoRelatorioController.listarMediaTemposChamados(req.params.dono, req, res);
		});


chamadoUtilRouter.route('/chamadosDia/:dono/:data')
		.get(function(req, res){
			console.log('vai listar o total de chamados do dia');
			ChamadoRelatorioController.listarTotaisChamadosDia(req.params.dono, req.params.data, req, res);
		});

chamadoUtilRouter.route('/qtdChamadosUltimos/:dono')
		.get(function(req, res){
			console.log('vai listar qtd de chamados dos ultimos dias');
			ChamadoRelatorioController.listarResumoQtdChamadosUltimos(req.params.dono, req, res);
		});

chamadoUtilRouter.route('/mediaAvaliacaoAtendimento/:dono')
		.get(function(req, res){
			console.log('vai listar a media de avaliação dos atendimentos');
			ChamadoRelatorioController.listarResumoMediaAvaliacoesChamados(req.params.dono, req, res);
		});

chamadoUtilRouter.route('/atendentesOcupadosPorRegiao/:idEmpresa')
		.get(function(req, res){
			console.log('vai listar os atendentes ocupados por região');
			ChamadoRelatorioController.listarAtendentesOcupadosPorRegiao(req.params.idEmpresa, req, res);
		});
	
chamadoUtilRouter.route('/xls')
		.get(function(req, res){
			console.log('chegou no route de exportar XLS');
			ChamadoRelatorioController.exportarChamado(req, res);
		});	

chamadoUtilRouter.route('/qtdChamadosPorCategoria/:idEmpresa')
		.get(function(req, res){
			console.log('chegou no route de qtdChamadosPorCategoria');
			ChamadoRelatorioController.listarResumoCategoriasChamados(req.params.idEmpresa, req, res);
		});	

chamadoUtilRouter.route('/qtdChamadosItensPorCategoria/:idCategoria')
		.get(function(req, res){
			console.log('chegou no route de qtdChamadosItensPorCategoria');
			ChamadoRelatorioController.listarResumoItensAtendimentosPorCategoria(req.params.idCategoria, req, res);
		});	
		
chamadoUtilRouter.route('/qtdChamadosPorSolicitante/:idEmpresa')
		.get(function(req, res){
			console.log('chegou no route de qtdChamadosPorSolicitante');
			ChamadoRelatorioController.listarResumoQtdPorSolicitante(req.params.idEmpresa, req, res);
		});	

chamadoUtilRouter.route('/qtdChamadosPorAtendente/:idEmpresa')
		.get(function(req, res){
			console.log('chegou no route de qtdChamadosPorAtendente');
			ChamadoRelatorioController.listarResumoQtdPorAtendente(req.params.idEmpresa, req, res);
		});	

		
	
module.exports = chamadoUtilRouter;
