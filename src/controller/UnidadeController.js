	
var moment = require('moment');
var Promise = require('promise');
var q = require('q');
var qrcode = require('../util/QRCodeUtil');


var unidadeController = function(unidadeModel){

	var salvarNovo = function(req, res){
		console.log(' ::: Salvar Nova Unidade ');
		var unidade = new unidadeModel(req.body);
		
		console.log(unidade);
		var msgObrigatorio = '';
		// CAMPOS OBRIGATORIOS: dono, idSolicitante, codigo, idUnidade
		if(!req.body.dono) {
			msgObrigatorio+= 'Dono é obrigatório.<br/>';
		}
		
		if(!req.body.nome) {
			msgObrigatorio+= 'Nome do unidade é obrigatório.<br/>';
		}

		if(!unidade.andar){
			unidade.andar = 1;
		}

		if(msgObrigatorio != '') {
			res.status(400);
			res.send(msgObrigatorio);
		} else {
			
			if(!unidade.codigo){
				unidade.codigo = Math.floor(Math.random() * 999999);
			}

			qrcode(unidade.codigo , function(urlQRCode){
				console.log('ENTROU NO SALVAR DEFINITIVAMENTE');
				unidade.qrcodeImg = urlQRCode;
				salvarUnidade();
			});

			var salvarUnidade = function(){
				unidade.save();
			
				res.status(201);
				res.send(unidade);	
			};
		}

	};


	var remover = function(req, res){
		console.log(' ::: Remover unidade');
		req.unidade.remove(function(err){
			if(err){
				res.status(500).send(err);
			} else {
				res.status(204).send('unidade removida.');
			}
		});
	
	};



	var atualizar = function(req, res){
		console.log(' ::: Atualizar unidade');
		if(req.body._id){
			delete req.body._id;
		}

		for(var p in req.body){
			req.unidade[p] = req.body[p];	
		}
		
		console.log(req.unidade);
		req.unidade.save(function(err){
			if(err){
				res.status(500).send(err);
			} else {
				res.json(req.unidade);
			}
		});
	};


	var listar = function(req, res){
		console.log(' ::: Listar unidade');
		
		unidadeModel.find(req.query, function(err, unidades){
			if(err){
				res.status(500).send(err);
			} else {
				res.json(unidades);
			}
		});
	};



	return {
		listar 		: listar,
		remover 	: remover,
		atualizar   : atualizar,
		salvarNovo 	: salvarNovo
	};

};

module.exports = unidadeController;