	
var moment = require('moment');
var Promise = require('promise');
var q = require('q');


var itemController = function(itemAtendimentoModel){

	var salvarNovo = function(req, res){
		//console.log(' ::: Salvar Nova item ');
		var item = new itemAtendimentoModel(req.body);
		
		//console.log(item);
		var msgObrigatorio = '';
		
		if(!req.body.dono) {
			msgObrigatorio+= 'Dono é obrigatório.<br/>';
		}

		if(!req.body.nome) {
			msgObrigatorio+= 'Nome é obrigatório.<br/>';
		}
		

		if(msgObrigatorio != '') {
			res.status(400);
			res.send(msgObrigatorio);
		} else {

			if(!item.codigo){
				item.codigo = Math.floor(Math.random() * 999999);
			}


			var validarItemMesmoNome = function() {
			  	var deferred = q.defer();

			  	var query = [];
			  	var nomeItem = "";
			  	if(item.nome){
					nomeItem = item.nome.toLowerCase();
			  	}
			  	query.push({nome : nomeItem });
			  	query.push({dono : item.dono});

			  	itemAtendimentoModel.where({ $and: query }).count(function (err, count) {
					//console.log('callback do VALIDACAO count item por nome :', count );
					if(!err){
				  		deferred.resolve(count);
					}
				});

			  	return deferred.promise;
			};


			var salvarDefinitivamente = function(){
				item.save();
				res.status(201);
				res.send(item);	
			};

			validarItemMesmoNome().then(function(total) {
 				//console.log('recuperou o total por pessoa');
 				if(total > 0){
					//console.log("ERRO: Item "+item.nome+" já existe.");
					res.status(403);
					res.end('Já existe uma item com o nome '+item.nome+'.');
				} else {
					salvarDefinitivamente();
				}
 			});


		}

	};


	var remover = function(req, res){
		//console.log(' ::: Remover item');
		req.item.remove(function(err){
			if(err){
				res.status(500).send(err);
			} else {
				res.status(204).send('item removido.');
			}
		});
	
	};


	var atualizar = function(req, res){
		//console.log(' ::: Atualizar item');
		if(req.body._id){
			delete req.body._id;
		}

		for(var p in req.body){
			req.item[p] = req.body[p];	
		}
		
		//console.log(req.item);
		req.item.save(function(err){
			if(err){
				res.status(500).send(err);
			} else {
				res.json(req.item);
			}
		});
	};


	var listar = function(req, res){
		//console.log(' ::: Listar item');
		
		itemAtendimentoModel.find(req.query, function(err, items){
			if(err){
				res.status(500).send(err);
			} else {
				res.json(items);
			}
		});
	};



	return {
		atualizar  	: atualizar,
		listar 		: listar,
		remover 	: remover,
		salvarNovo 	: salvarNovo
	};

};

module.exports = itemController;