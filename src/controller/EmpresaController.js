	
var moment = require('moment');
var empresaController = function(empresaModel){

	var salvarNovo = function(req, res){
		//console.log(' ::: Salvar Novo Empresa ');
		var empresa = new empresaModel(req.body);
		
		//console.log(empresa);
		var msgObrigatorio = '';
		// CAMPOS OBRIGATORIOS: dono, idSolicitante, codigo, idUnidade
		if(!req.body.dono) {
			msgObrigatorio+= 'Dono é obrigatório.<br/>';
		}
		
		if(!req.body.nomeEmpresa) {
			msgObrigatorio+= 'Empresa é obrigatório.<br/>';
		}


		if(msgObrigatorio != '') {
			res.status(400);
			res.send(msgObrigatorio);
		} else {
			empresa.save();
			
			res.status(201);
			res.send(empresa);	
		}

	};


	var remover = function(req, res){
		//console.log(' ::: Remover empresa');
		req.empresa.remove(function(err){
			if(err){
				res.status(500).send(err);
			} else {
				res.status(204).send('Empresa removido.');
			}
		});
	
	};


	var atualizar = function(req, res){
		//console.log(' ::: Atualizar empresa');
		if(req.body._id){
			delete req.body._id;
		}

		for(var p in req.body){
			req.empresa[p] = req.body[p];	
		}
		
		//console.log(req.empresa);
		req.empresa.save(function(err){
			if(err){
				res.status(500).send(err);
			} else {
				res.json(req.empresa);
			}
		});
	};


	var listar = function(req, res){
		//console.log(' ::: Listar empresa');
		
		empresaModel.find(req.query, function(err, empresas){
			if(err){
				res.status(500).send(err);
			} else {
				res.json(empresas);
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

module.exports = empresaController;