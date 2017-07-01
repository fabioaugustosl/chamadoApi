	
var moment = require('moment');

var notificacaoController = function(notificacaoModel){


	var salvarNovoSimples = function(notificacao){
		
		console.log(notificacao);
		var msgObrigatorio = '';
		// CAMPOS OBRIGATORIOS: dono, idSolicitante, idCategoria, idUnidade
		if(!notificacao.dono) {
			return false;
		} else if(!notificacao.idPessoa) {
			return false;
		} else if(!notificacao.msg) {
			return false;
		} else {
			notificacao.dataCriacao = moment().second(0).millisecond(0).utc().format();
			notificacao.lido = false;
			if(!notificacao.tipo){
				notificacao.tipo = "NOTIFICACAO_SIMPLES";
			}
			notificacao.save();
			return true;
		}

	};


	var salvarNovo = function(req, res){
		console.log(' ::: Salvar Novo ');
		var notificacao = new notificacaoModel(req.body);
		
		console.log(notificacao);
		var msgObrigatorio = '';
		// CAMPOS OBRIGATORIOS: dono, idSolicitante, idCategoria, idUnidade
		if(!req.body.dono) {
			msgObrigatorio+= 'Dono é obrigatório.<br/>';
		}
		if(!req.body.idPessoa) {
			msgObrigatorio+= 'Pessoa é obrigatório.<br/>';
		}
		if(!req.body.msg) {
			msgObrigatorio+= 'Mensagem é obrigatória.<br/>';
		}

		if(msgObrigatorio != '') {
			res.status(400);
			res.send(msgObrigatorio);
		} else {
			notificacao.dataCriacao = moment().second(0).millisecond(0).utc().format();

			notificacao.lido = false;
			
			if(!notificacao.tipo){
				notificacao.tipo = "NOTIFICACAO_SIMPLES";
			}

			notificacao.save();
		
			res.status(201);
			res.send(notificacao);	
		}

	};


	
	var registrarLeituraNotificacao = function(idNotificacao, req, res){
			console.log(' ::: ler notificacao ');
		if(!idNotificacao){
			res.status(403).end("ID do Notificação é obrigatória para iniciar registrar a leitura.");
		} else {	

			notificacaoModel.findById(idNotificacao, function(err, notificacao){
				console.log("mudar notificacao para lida", notificacao);
				if(err){
					res.status(500).send(err);
				} else if(notificacao) {
					
					notificacao.dataLeitura = moment().second(0).millisecond(0).utc().format();
					
					notificacao.save(function(err){
						console.log('call back atualizacao chamado');
						if(err){
							res.status(500).send(err);
						} else {
							console.log('vai retornar 201 - Notificação');
							res.status(201).send("OK");
						}
					});

				} else {
					res.status(404).send('Notificação não encontrado');
				}
			});
		}
	};



	var remover = function(req, res){
		console.log(' ::: Remover notificacao');

		req.notificacao.remove(function(err){
			if(err){
				res.status(500).send(err);
			} else {
				res.status(204).send('Notificacao removido.');
			}
		});	
	
	};



	var listar = function(req, res){
		console.log(' ::: Listar notificacao');
		
		notificacaoModel.find(req.query, function(err, notificacoes){
			if(err){
				res.status(500).send(err);
			} else {
				res.json(notificacoes);
			}
		});
	};



	return {
		registrarLeituraNotificacao 	: registrarLeituraNotificacao,
		listar 		: listar,
		remover 	: remover,
		salvarNovo 	: salvarNovo,
		salvarNovoSimples : salvarNovoSimples
	};

};

module.exports = notificacaoController;