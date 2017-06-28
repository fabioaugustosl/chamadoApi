	
var moment = require('moment');
var Promise = require('promise');
var q = require('q');


var categoriaController = function(categoriaModel,itemAtendimentoModel){

	var salvarNovo = function(req, res){
		console.log(' ::: Salvar Nova Categoria ');
		var categoria = new categoriaModel(req.body);
		
		console.log(categoria);
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

			
			if(!categoria.codigo){
				categoria.codigo = Math.floor(Math.random() * 999999);
			}

			var validarCategoriaMesmoNome = function() {
			  	var deferred = q.defer();

			  	var query = [];
			  	query.push({nome : categoria.nome.toLowerCase()});
			  	query.push({dono : categoria.dono});
			  	
			  	categoriaModel.where({ $and: query }).count(function (err, count) {
					console.log('callback do VALIDACAO count Categoria por nome :', count );
					if(!err){
				  		deferred.resolve(count);
					}
				});

			  	return deferred.promise;
			};


			var salvarDefinitivamente = function(){
				categoria.save();
				res.status(201);
				res.send(categoria);	
			};

			validarCategoriaMesmoNome().then(function(total) {
 				//console.log('recuperou o total por pessoa');
 				if(total > 0){
					console.log("ERRO: A "+categoria.nome+" já existe.");
					res.status(403);
					res.end('Já existe uma categoria com o nome '+categoria.nome+'.');
				} else {
					salvarDefinitivamente();
				}
 			});


		}

	};


	var remover = function(req, res){
		console.log(' ::: Remover categoria');
		req.categoria.remove(function(err){
			if(err){
				res.status(500).send(err);
			} else {
				res.status(204).send('Categoria removida.');
			}
		});
	
	};


	var atualizar = function(req, res){
		console.log(' ::: Atualizar categoria');
		if(req.body._id){
			delete req.body._id;
		}

		for(var p in req.body){
			req.categoria[p] = req.body[p];	
		}
		
		console.log(req.categoria);
		req.categoria.save(function(err){
			if(err){
				res.status(500).send(err);
			} else {
				res.json(req.categoria);
			}
		});
	};


	var adicionarItem = function(idCategoria,req, res){
		console.log(' ::: Adicionar  novo item');

		var item = new itemAtendimentoModel(req.body);

		//unidade.dono = req.body.dono;
		//unidade.idPredio = req.body.idPredio;
		//unidade.nome = req.body.nome;
		//unidade.andar = req.body.andar;

		categoriaModel.findById(idCategoria, function(err, categoria){
			if(!err){

				categoria.itens.push(item);

				categoria.save(function(err){
						if(err){
							res.status(500).send(err);
						} else {
							res.status(201);
							res.send(categoria);	
						}
					});
				
			} else {
				res.status(404).send('regiao não encontrado');
			}
		});
		
	
	};

	var listar = function(req, res){
		console.log(' ::: Listar categoria');
		
		categoriaModel.find(req.query)
			.populate('itens')
			.exec(function(err, categorias){
				if(err){
					res.status(500).send(err);
				} else {
					res.json(categorias);
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

module.exports = categoriaController;