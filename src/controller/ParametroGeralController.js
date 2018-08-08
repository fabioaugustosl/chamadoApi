	
var moment = require('moment');
var parametroController = function(parametroModel){

	var salvarNovo = function(req, res){
		//console.log(' ::: Salvar Novo Parametro ');
		var parametro = new parametroModel(req.body);
		
		//console.log(parametro);
		var msgObrigatorio = '';
		if(!req.body.dono) {
			msgObrigatorio+= 'Dono é obrigatório.<br/>';
		}
		
		if(!req.body.idEmpresa) {
			msgObrigatorio+= 'Empresa é obrigatório.<br/>';
		}


		if(msgObrigatorio != '') {
			res.status(400);
			res.send(msgObrigatorio);
		} else {
			parametro.save();
			
			res.status(201);
			res.send(parametro);	
		}

	};


	var remover = function(req, res){
		//console.log(' ::: Remover parametro');
		req.parametro.remove(function(err){
			if(err){
				res.status(500).send(err);
			} else {
				res.status(204).send('Região removido.');
			}
		});
	
	};



	var atualizar = function(req, res){
		//console.log(' ::: Atualizar parametro');
		if(req.body._id){
			delete req.body._id;
		}

		for(var p in req.body){
			req.parametro[p] = req.body[p];	
		}
		
		//console.log(req.parametro);
		req.parametro.save(function(err){
			if(err){
				res.status(500).send(err);
			} else {
				res.json(req.parametro);
			}
		});
	};


	var listar = function(req, res){
		//console.log(' ::: Listar parametro');
		
		parametroModel.find(req.query, function(err, regioes){
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
		atualizar   : atualizar,
		salvarNovo 	: salvarNovo
	};

};

module.exports = parametroController;