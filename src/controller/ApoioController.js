	
var md5 = require('md5');
var moment = require('moment');
var apoioController = function(apoioModel){

	var salvarNovo = function(req, res){
		console.log(' ::: Salvar Novo Apoio ');
		var apoio = new apoioModel(req.body);
		
		console.log(apoio);
		var msgObrigatorio = '';

		if(!req.body.dono) {
			msgObrigatorio+= 'Dono é obrigatório.<br/>';
		}
		
		if(!req.body.empresa) {
			msgObrigatorio+= 'Empresa é obrigatório.<br/>';
		}

		if(!req.body.nome) {
			msgObrigatorio+= 'Nome é obrigatório.<br/>';
		}

		if(apoio.senha){
			var hash = md5(apoio.senha);
			apoio.senha = hash;
		}

		if(msgObrigatorio != '') {
			res.status(400);
			res.send(msgObrigatorio);
		} else {
			apoio.save();
			
			res.status(201);
			res.send(apoio);	
		}

	};


	var remover = function(req, res){
		console.log(' ::: Remover apoio');
		req.apoio.remove(function(err){
			if(err){
				res.status(500).send(err);
			} else {
				res.status(204).send('apoio removido.');
			}
		});
	
	};



	var atualizar = function(req, res){
		console.log(' ::: Atualizar apoio');
		delete req.body.__v;
		if(req.body._id){
			delete req.body._id;
		}

		for(var p in req.body){
			if(p == 'senha' && req.body[p] && req.body[p].length < 20){
				var hash = md5(req.body[p]);
				req.body[p] = hash;
			} 
			
			req.apoio[p] = req.body[p];	
			
		}
		
		console.log(req.apoio);
		req.apoio.save(function(err){
			if(err){
				res.status(500).send(err);
			} else {
				res.json(req.apoio);
			}
		});
	};


	var listar = function(req, res){
		console.log(' ::: Listar apoio');

		var query = [];

		if(req.query){

			if(req.query.nome){
				query.push({nome : RegExp(req.query.nome, "i") });
			}

			if(req.query.super){
				query.push({super : req.query.super});
			}

			if(req.query.login){
				query.push({login : req.query.login});
			}

			if(req.query.email){
				query.push({email : RegExp(req.query.email, "i") });
			}

		}
		 
		console.log(query);
		var queryFinal = {};
		if(query && query.length > 0){
			queryFinal = { $and: query };
		}

		
		apoioModel.find(queryFinal)
			.populate('empresa')
			.exec(function(err, apoios){
				if(err){
					res.status(500).send(err);
				} else {
					res.json(apoios);
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

module.exports = apoioController;