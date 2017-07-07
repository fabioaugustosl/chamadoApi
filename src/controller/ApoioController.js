	
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
		if(req.body._id){
			delete req.body._id;
		}

		for(var p in req.body){
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
		
		apoioModel.find(req.query)
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