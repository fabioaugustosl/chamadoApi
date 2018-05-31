var express = require('express');

var autorizadoModel = require('../models/SolicitanteAutorizadoModel');

var loginRouter = express.Router();

var AutorizadoController = require('../controller/SolicitanteAutorizadoController')(autorizadoModel);


loginRouter.route('/autorizado/')
		.post(function(req, res){
			console.log('chegou no autenticar usuario solicitante autorizado ', req.body);
			AutorizadoController.autenticar(req.body.cpf, req, res);
		});


module.exports = loginRouter;
