	
var moment = require('moment');
var Promise = require('promise');
var q = require('q');

var chamadoController = function(chamadoModel, grupoModel){

	var salvarNovo = function(req, res){
		console.log(' ::: Salvar Novo ');
		var chamado = new chamadoModel(req.body);
		
		console.log(chamado);
		var msgObrigatorio = '';
		// CAMPOS OBRIGATORIOS: dono, idSolicitante, idCategoria, idUnidade
		if(!req.body.dono) {
			msgObrigatorio+= 'Dono é obrigatório.<br/>';
		}
		if(!req.body.idSolicitante) {
			msgObrigatorio+= 'Solicitante é obrigatório.<br/>';
		}
		if(!req.body.idCategoria) {
			msgObrigatorio+= 'Categoria do chamado é obrigatória.<br/>';
		}
		if(!req.body.idUnidade) {
			msgObrigatorio+= 'A unidade de origem do chamado é obrigatória.<br/>';
		}
		

		if(msgObrigatorio != '') {
			res.status(400);
			res.send(msgObrigatorio);
		} else {
			chamado.dataCriacao = moment().second(0).millisecond(0).utc().format();


			// REGRA VALIDACAO 1: não é permitido um solicitante abrir um novo chamado para a mesma unidade, desde que esse chamado ainda esteja aberto. 
			var recuperarChamadoAbertoParaEsseSolicitanteEUnidade = function() {
			  	var deferred = q.defer();

			   	chamadoModel.where({ 'dono': chamado.dono , 'idUnidade': chamado.idUnidade, 'idSolicitante': chamado.idSolicitante, 'deletado': false, 'dataFim': null})
			   			.count(function (err, count) {
					console.log('callback do count recuperarChamadoAbertoParaEsseSolicitanteEUnidade :', count );
					if(!err){
				  		deferred.resolve(count);
					}
				});

			  	return deferred.promise;
			};


			var recuperarRegiaoDaUnidade = function() {
			  	var deferred = q.defer();

			  	//console.log('Vai pesquisar pela unidade : ', chamado.idUnidade)
			   	grupoModel.find({ unidades : { $all : [chamado.idUnidade] }}, function(err, regiao){
			   		//console.log('chegou no log do promise de recuperar a regiao da unidade: ', regiao);
					if(err){
						res.status(500).send(err);
					} else {
						deferred.resolve(regiao);
					}
				});

			  	return deferred.promise;
			};

			
			recuperarChamadoAbertoParaEsseSolicitanteEUnidade().then(function(total) {
				if(!total || total == 0){
					recuperarRegiaoDaUnidade().then(function(regiao){
						console.log("vou setar a regiao",regiao[0]._id);
					
						chamado.idRegiao = regiao[0]._id;
						chamado.nomeRegiao = regiao[0].nome;

						chamado.save();
			
						res.status(201);
						res.send(chamado);	
					});
				} else {
					res.status(403);
					res.end('Já existe um chamado aberto deste solicitante para essa unidade.');
				}
			});


		}

	};


	var atualizar = function(req, res){
		console.log(' ::: Atualizar chamado ');
		if(req.body._id){
			delete req.body._id;
		}

		for(var p in req.body){
			req.chamado[p] = req.body[p];	
		}
		
		console.log(req.chamado);
		req.chamado.save(function(err){
			console.log('call back atualizacao chamado');
			if(err){
				res.status(500).send(err);
			} else {
				console.log('vai retornar 201 - atualizacao chamado');
				res.status(201).send();
			}
		});
	};


	var avaliarAtendimento = function(idChamado, req, res){
		console.log(' ::: avaliar chamado ');
		if(req.body._id){
			delete req.body._id;
		}

		console.log("idCategoria : ",req.body.idCategoria);
		console.log("nomeCategoria : ",req.body.nomeCategoria);

		if(!req.body.itens){
			res.status(403).end("É necessário informa um item para completar a avaliação");
		} else {

			chamadoModel.findById(idChamado, function(err, chamado){
				console.log("vai avaliar esse chamado", chamado);
				if(err){
					res.status(500).send(err);
				} else if(chamado) {
					
					if(req.body.idCategoria){
						chamado.idCategoria = req.body.idCategoria;	
					}

					if(req.body.nomeCategoria){
						chamado.nomeCategoria = req.body.nomeCategoria;	
					}

					console.log(req.body.itens);
					//for(var p in req.body.itens){
					//	console.log(p)
						chamado.itens = req.body.itens;	
					//}
					
					chamado.save(function(err){
						console.log('call back atualizacao chamado');
						if(err){
							res.status(500).send(err);
						} else {
							console.log('vai retornar 201 - avaliado chamado');
							res.status(201).send("OK");
						}
					});

				} else {
					res.status(404).send('Chamado não encontrado');
				}
			});
		}	
	
	};


	var iniciarAtendimento = function(idChamado, idAtendente, nomeAtendente, req, res){
		console.log(' ::: Iniciar atendimento chamado ');
		if(!idChamado || !idAtendente){
			res.status(403).end("ID do chamado e ID do atentente são obrigatórios para iniciar um atendimento.");
		} else {
			chamadoModel.findById(idChamado, function(err, chamado){
				if(err){
					res.status(500).send(err);
				} else if(chamado) {
					
						if(chamado.dataApoio){
							res.status(403).send('Chamado já está em atendimento');
						} else {
							chamado.dataApoio =  moment().second(0).millisecond(0).utc().format();
							chamado.idAtendente = idAtendente;
							chamado.nomeAtendente = nomeAtendente;

							chamado.save(function(err){
								if(err){
									res.status(500).send(err);
								} else {
									console.log('vai retornar 201 - chamado em atendimento');
									res.status(201).send("OK");
								}
							});
						}

				} else {
					res.status(404).send('Chamado não encontrado');
				}
			});
		}

		
	};


	var finalizarAtendimento = function(idChamado, req, res){
		console.log(' ::: Finalizar atendimento chamado ');

		chamadoModel.findById(idChamado, function(err, chamado){
			if(err){
				res.status(500).send(err);
			} else if(chamado) {
				
				if(chamado.dataFim){
					res.status(403).send('Chamado já foi finalizado anteriormente');
				} else {
					chamado.dataFim =  moment().second(0).millisecond(0).utc().format();
					
					chamado.save(function(err){
						if(err){
							res.status(500).send(err);
						} else {
							console.log('vai retornar 201 - chamado finalizado');
							res.status(201).send("OK");
						}
					});
				}

			} else {
				res.status(404).send('Chamado não encontrado');
			}
		});
	};



	var remover = function(req, res){
		console.log(' ::: Remover Chamado');

		req.chamado.remove(function(err){
			if(err){
				res.status(500).send(err);
			} else {
				res.status(204).send('Chamado removido.');
			}
		});	
	
	};


	var removerLogico = function(idChamado, req, res){
		console.log(' ::: Remover Logico Chamado');

		chamadoModel.findById(idChamado, function(err, chamado){
			if(err){
				res.status(500).send(err);
			} else if(chamado) {
				if(req.chamado.dataApoio){
					res.status(403).end("Chamado em atendimento. Não é possível removê-lo.");
				} else {
					chamado.deletado = true;
					
					chamado.save(function(err){
						if(err){
							res.status(500).send(err);
						} else {
							console.log('vai retornar 201 - chamado deletado logicamente');
							res.status(201).send("OK");
						}
					});
				}

			} else {
				res.status(404).send('Chamado não encontrado');
			}
		});
	
	};


	var listar = function(req, res){
		console.log(' ::: Listar Chamados');
		var query = {};
		//console.log(moment().format()); 	
		if(req.query){
			//query = req.query;
			if(req.query.dataCriacao){
				query.push({dataCriacao : moment(query.dataCriacao, "DD/MM/YYYY").format()});
			} 
			if(req.query.dataFim){
				query.push({dataFim : moment(query.dataFim, "DD/MM/YYYY").format()});
			}

			if(req.query.dataCriacaoDe && query.dataCriacaoAte){
				query.push({
                    $gte: moment(query.dataCriacaoDe, "DD/MM/YYYY").hour(0).minute(0).second(0).millisecond(0).format(),
                    $lte: moment(query.dataCriacaoAte, "DD/MM/YYYY").hour(23).minute(59).second(59).millisecond(999).format()
                });
			}

			if(req.query.dataFimDe && query.dataFimAte){
				query.push({
                    $gte: moment(query.dataFimDe, "DD/MM/YYYY").hour(0).minute(0).second(0).millisecond(0).format(),
                    $lte: moment(query.dataFimAte, "DD/MM/YYYY").hour(23).minute(59).second(59).millisecond(999).format()
                });
			}

			if(req.query.deletado){
				query.push({deletado : req.query.deletado});
			}
			
			if(req.query.idCategoria){
				query.push({idCategoria : req.query.idCategoria});
			}	
			
			if(req.query.idRegiao){
				query.push({idRegiao : req.query.idRegiao});
			}	

			if(req.query.idSolicitante){
				query.push({idSolicitante : req.query.idSolicitante});
			}

			if(req.query.nomeSolicitante){
				query.push({nomeSolicitante : RegExp(req.query.nomeSolicitante, "i") });
			}
		}

		console.log(query);
		var queryFinal = {};
		if(query && query.length > 0){
			queryFinal = { $and: query };
		}

		chamadoModel.find(queryFinal, function(err, chamados){
			if(err){
				res.status(500).send(err);
			} else {
				res.json(chamados);
			}
		});
	};


	/*
	* indAbertos = 1 mostra apenas os abertos
	* indAbertos = 0 mostra apenas os fechados
	*/
	var listarChamadosPorSolicitante = function(idSolicit, indAbertos, req, res){
		console.log(' ::: Listar Chamados abertos por solicitante');
		var query = [];
		
		query.push({idSolicitante : idSolicit});
		query.push({deletado : false});

		if(indAbertos == 1){
			query.push({dataFim :  null});
		} else {
			query.push({dataFim :  { $ne: null }});
		}
		
		var queryFinal = {};
		if(query && query.length > 0){
			queryFinal = { $and: query };
		}

		console.log(queryFinal);

		chamadoModel.find(queryFinal, function(err, chamados){
			if(err){
				res.status(500).send(err);
			} else {
				res.json(chamados);
			}
		});
	};


	return {
		listarChamadosPorSolicitante : listarChamadosPorSolicitante,
		avaliarAtendimento : avaliarAtendimento,
		finalizarAtendimento : finalizarAtendimento,
		iniciarAtendimento : iniciarAtendimento,
		atualizar 	: atualizar,
		listar 		: listar,
		remover 	: remover,
		removerLogico : removerLogico,
		salvarNovo 	: salvarNovo
	};

};

module.exports = chamadoController;