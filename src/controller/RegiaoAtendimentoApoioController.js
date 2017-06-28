/*	
var moment = require('moment');
var chamadoController = function(regiaoModel){

	var salvarNovo = function(req, res){
		console.log(' ::: Salvar Nova Regiao ');
		var regiao = new regiaoModel(req.body);
		
		console.log(regiao);
		var msgObrigatorio = '';
		// CAMPOS OBRIGATORIOS: dono, idSolicitante, codigo, idUnidade
		if(!req.body.dono) {
			msgObrigatorio+= 'Dono é obrigatório.<br/>';
		}
		if(!req.body.idAtendente) {
			msgObrigatorio+= 'Solicitante é obrigatório.<br/>';
		}
		if(!req.body.codigo) {
			msgObrigatorio+= 'Código da região é obrigatória.<br/>';
		}
		if(!req.body.idUnidade) {
			msgObrigatorio+= 'A unidade é obrigatória.<br/>';
		}
		

		if(msgObrigatorio != '') {
			res.status(400);
			res.send(msgObrigatorio);
		} else {
			regiao.save();
			
			res.status(201);
			res.send(regiao);	
		}

	};


	var remover = function(req, res){
		console.log(' ::: Remover regiao');
		req.regiao.remove(function(err){
			if(err){
				res.status(500).send(err);
			} else {
				res.status(204).send('Região removido.');
			}
		});
	
	};



	var listar = function(req, res){
		console.log(' ::: Listar regiao');
		
		regiaoModel.find(req.query, function(err, regioes){
			if(err){
				res.status(500).send(err);
			} else {
				res.json(regioes);
			}
		});
	};

	return {
		listar 		: listar,
		remover 	: remover,
		salvarNovo 	: salvarNovo
	};

};

module.exports = chamadoController;*/