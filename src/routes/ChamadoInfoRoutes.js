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


module.exports = chamadoUtilRouter;
