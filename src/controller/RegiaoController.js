	
var moment = require('moment');
var Promise = require('promise');
var q = require('q');

var regiaoController = function(regiaoModel, unidadeModel){

	var salvarNovo = function(req, res){
		//console.log(' ::: Salvar Nova Região');
		var regiao = new regiaoModel(req.body);
		
		//console.log(regiao);
		var msgObrigatorio = '';

		if(!req.body.dono) {
			msgObrigatorio+= 'Dono é obrigatório.<br/>';
		}


		if(!req.body.empresa) {
			msgObrigatorio+= 'Empresa é obrigatória.<br/>';
		}

		if(!req.body.nome) {
			msgObrigatorio+= 'Nome é obrigatório.<br/>';
		}
		

		if(msgObrigatorio != '') {
			res.status(400);
			res.send(msgObrigatorio);
		} else {


			var validarRegiaoMesmoNome = function() {
			  	var deferred = q.defer();

			  	var query = [];
			  	query.push({nome : regiao.nome.toLowerCase()});
			  	query.push({idEmpresa : regiao.idEmpresa});
			  	query.push({dono : regiao.dono});

			  	regiaoModel.where({ $and: query }).count(function (err, count) {
					//console.log('callback do VALIDACAO count Regiao por nome e idEmpresa :', count );
					if(!err){
				  		deferred.resolve(count);
					}
				});

			  	return deferred.promise;
			};


			var salvarDefinitivamente = function(){
				regiao.save();
			
				res.status(201);
				res.send(regiao);	
			};

			validarRegiaoMesmoNome().then(function(total) {
 				//console.log('recuperou o total por pessoa');
 				if(total > 0){
					//console.log("ERRO: A "+regiao.nome+" já existe para esse empresa.");
					res.status(403);
					res.end('Já existe uma região com o nome '+regiao.nome+' para a empresa informada.');
				} else {
					salvarDefinitivamente();
				}
 			});

				
		}
		
	};


	var atualizar = function(req, res){
		//console.log(' ::: Atualizar regiao ');
		delete req.body.__v;
		if(req.body._id){
			delete req.body._id;
		}

		for(var p in req.body){
			req.regiao[p] = req.body[p];	
		}
		
		//console.log(req.regiao);
		req.regiao.save(function(err){
			console.log('call back atualizacao regiao');
			if(err){
				res.status(500).send(err);
			} else {
				//console.log('vai retornar 201 - atualizacao regiao');
				res.status(201).send();
			}
		});
	};


	var adicionarUnidade = function(idRegiao,req, res){
		//console.log(' ::: Adicionar  nova unidade');

		var unidade = new unidadeModel();

		//unidade.dono = req.body.dono;
		//unidade.idPredio = req.body.idPredio;
		//unidade.nome = req.body.nome;
		//unidade.andar = req.body.andar;

		regiaoModel.findById(idRegiao, function(err, regiao){
			if(!err){

				regiao.unidades.push(unidade);

				regiao.save(function(err){
						if(err){
							res.status(500).send(err);
						} else {
							res.status(201);
							res.send(regiao);	
						}
					});
				
			} else {
				res.status(404).send('regiao não encontrado');
			}
		});
		
	
	};


	var remover = function(req, res){
		//console.log(' ::: Remover regiao');

		req.regiao.remove(function(err){
			if(err){
				res.status(500).send(err);
			} else {
				res.status(204).send('regiao removido.');
			}
		});	
	
	};


	var listar = function(req, res){
		regiaoModel.find(req.query)
			.populate('unidades')
			.populate('apoios')
			.exec(function(err, regioes){
			if(err){
				res.status(500).send(err);
			} else {
				res.json(regioes);
			}
		});
	};


	return {
		adicionarUnidade : adicionarUnidade,
		atualizar 	: atualizar,
		listar 		: listar,
		remover 	: remover,
		salvarNovo 	: salvarNovo
	};

};

module.exports = regiaoController;