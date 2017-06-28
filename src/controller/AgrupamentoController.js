	
var moment = require('moment');
var agrupamentoController = function(agrupamentoModel){

	var salvarNovo = function(req, res){
		console.log(' ::: Salvar Novo Agrupmento ');
		var agrupamento = new agrupamentoModel(req.body);
		
		console.log(agrupamento);
		var msgObrigatorio = '';
		// CAMPOS OBRIGATORIOS: dono, idSolicitante, codigo, idUnidade
		if(!req.body.dono) {
			msgObrigatorio+= 'Dono é obrigatório.<br/>';
		}
		
		if(!req.body.nome) {
			msgObrigatorio+= 'Nome do agrupamento é obrigatório.<br/>';
		}

		if(!agrupamento.qtdAndares){
			agrupamento.qtdAndares = 1;
		}

		if(msgObrigatorio != '') {
			res.status(400);
			res.send(msgObrigatorio);
		} else {
			agrupamento.save();
			
			res.status(201);
			res.send(agrupamento);	
		}

	};


	var remover = function(req, res){
		console.log(' ::: Remover agrupamento');
		req.agrupamento.remove(function(err){
			if(err){
				res.status(500).send(err);
			} else {
				res.status(204).send('Agrupamento removido.');
			}
		});
	
	};



	var atualizar = function(req, res){
		console.log(' ::: Atualizar agrupamento');
		if(req.body._id){
			delete req.body._id;
		}

		for(var p in req.body){
			req.agrupamento[p] = req.body[p];	
		}
		
		console.log(req.agrupamento);
		req.agrupamento.save(function(err){
			if(err){
				res.status(500).send(err);
			} else {
				res.json(req.agrupamento);
			}
		});
	};


	var listar = function(req, res){
		console.log(' ::: Listar agrupamento');
		
		agrupamentoModel.find(req.query, function(err, agrupamentos){
			if(err){
				res.status(500).send(err);
			} else {
				res.json(agrupamentos);
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

module.exports = agrupamentoController;