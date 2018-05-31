	
var moment = require('moment');


var autorizadoController = function(autorizadoModel){

	var salvarNovo = function(req, res){
		console.log(' ::: Salvar Novo Solicitante Autorizado ');
		var autorizado = new autorizadoModel(req.body);
		
		console.log(autorizado);
		var msgObrigatorio = '';
		// CAMPOS OBRIGATORIOS: dono, idSolicitante, codigo, idUnidade
		if(!req.body.dono) {
			msgObrigatorio+= 'Dono é obrigatório.<br/>';
		}
		
		if(!req.body.nome) {
			msgObrigatorio+= 'Nome do solicitante autorizado é obrigatório.<br/>';
		}

		if(!req.body.cpf) {
			msgObrigatorio+= 'CPF do solicitante autorizado é obrigatório.<br/>';
		} else {
			autorizado.cpf = req.body.cpf.replace(/[^0-9]/g,'');
		}

		if(req.body.celular) {
			autorizado.celular = req.body.celular.replace(/[^0-9]/g,'');
		}

		if(msgObrigatorio != '') {
			res.status(400);
			res.send(msgObrigatorio);
		} else {
			autorizado.save();
			
			res.status(201);
			res.send(autorizado);	
		}

	};


	var remover = function(req, res){
		console.log(' ::: Remover autorizado');
		req.autorizado.remove(function(err){
			if(err){
				res.status(500).send(err);
			} else {
				res.status(204).send('Autorizado removido.');
			}
		});
	
	};



	var atualizar = function(req, res){
		console.log(' ::: Atualizar solicitante autorizado');
		if(req.body._id){
			delete req.body._id;
		}

		for(var p in req.body){
			req.autorizado[p] = req.body[p];	
		}
		
		console.log(req.autorizado);
		req.autorizado.save(function(err){
			if(err){
				res.status(500).send(err);
			} else {
				res.json(req.autorizado);
			}
		});
	};


	var listar = function(req, res){
		console.log(' ::: Listar solicitante autorizado');

		var query = [];
		if(req.query){
			
			if(req.query.dono){
				query.push({dono : req.query.dono});
			}

			if(req.query.nome){
				query.push({nome : RegExp(req.query.nome, "i") });
			}
			
			if(req.query.cpf){
				query.push({cpf : req.query.cpf.replace(/[^0-9]/g,'')});
			}	
			
			if(req.query.celular){
				query.push({celular : req.query.celular.replace(/[^0-9]/g,'')});
			}	

			if(req.query.email){
				query.push({email : req.query.email});
			}
		}

		console.log(query);
		var queryFinal = {};
		if(query && query.length > 0){
			queryFinal = { $and: query };
		}
		

		autorizadoModel.find(queryFinal)
				.exec( function(err, autorizados){
			if(err){
				res.status(500).send(err);
			} else {
				res.json(autorizados);
			}
		});
	};



	var autenticar = function(cpfDigitado, req, res){
		console.log('cpfDigitado: ',cpfDigitado);
		if(!cpfDigitado){
			res.status(500).send("Cpf inválido");
		} else {
			autorizadoModel.find({cpf : cpfDigitado},  function(err, solicitante){
				if(err){
					res.status(500).send(err);
				} else {
					if(solicitante && solicitante.length > 0){
						res.json(solicitante);
					} else {
						res.status(500).send("Cpf não autorizado.");
					}
				}
			});	
		}
		
	};

	



	return {
		listar 		: listar,
		remover 	: remover,
		atualizar   : atualizar,
		salvarNovo 	: salvarNovo,
		autenticar : autenticar
	};

};

module.exports = autorizadoController;