	
var moment = require('moment');
var Promise = require('promise');
var q = require('q');
var classificadorStatus = require('../util/ClassificadorStatusChamado');

/*Controller para gerar as notificações a medida que as acoes no chamado forem ocorrendo*/
var SolicitanteAutorizadoModel = require('../models/SolicitanteAutorizadoModel');

var chamadoRelatorioController = function(chamadoModel, grupoModel){


	var listarResumoCategoriasChamados = function(empresa, req, res){
		//console.log('entrou na listarResumoCategoriasChamados - id empresa : ',empresa);
		chamadoModel.aggregate(
	    [	
	    	{
	           "$match": {
	                //idEmpresa: empresa
	                dono: empresa
	            }
        	},
			{ 
				"$group": { 
			       	_id: {nome: "$nomeCategoria", id: "$idCategoria"},
			       	total: { $sum: 1 } 
				}
			}
	    ],
	    function(err,result) {
	    	//console.log(result);
	    	res.status(201);
			res.send(result);
	    }
		);
	};


	var listarResumoItensAtendimentosPorCategoria = function(categoria, req, res){
		//console.log('entrou na listarResumoItensAtendimentosPorCategoria - id categoria : ',categoria);
		
		chamadoModel.find( {idCategoria: categoria} )
		.populate("itens")
		.limit(200)
  		.sort({ dataCriacao: -1 })
		.exec(function(err, chamados){
			//console.log('chamados retorno itens : ',chamados);
			if(err){
				res.status(500).send(err);
			} else {
				var returnChamados = [];
				
				chamados.forEach(function(element, index, array){
					var chamadoObj = element.toJSON();
					if(chamadoObj.itens && chamadoObj.itens.length > 0){
						chamadoObj.itens.forEach(function(e, i, a){
							//console.log(e);
							var itemObj = e ; //e.toJSON();
							let cont = returnChamados[itemObj.nome];
							if(!cont){
								cont = 0;
							}
							cont++;
							returnChamados[itemObj.nome] = cont;
						});
					}
					
					//console.log(' return chamados: ',returnChamados);
				});

				var retorno = [];

				for (chaveArray in returnChamados){
					let total = returnChamados[chaveArray];
					let c = {};
					c.item = chaveArray;
					c.total = total;
					retorno.push(c);
				}

				res.json(retorno);
			}
		});
	};



	var listarResumoQtdPorSolicitante = function(empresa, req, res){
		//console.log('entrou na listarResumoQtdPorSolicitante - id empresa / dono: ',empresa);
		chamadoModel.aggregate(
		    [	
		    	{
		           "$match": {
		                //idEmpresa: empresa
		                dono: empresa
		            }
	        	},
				{ 
					"$group": { 
				       	_id: {nome: "$nomeSolicitante"},
				       	total: { $sum: 1 } 
					}
				}
		    ],
		    function(err,result) {
		    	//console.log(result);
		    	res.status(201);
				res.send(result);
		    }
		);
	};



	var listarResumoQtdPorAtendente = function(empresa, req, res){
		//console.log('entrou na listarResumoQtdPorAtendente - id empresa / dono: ',empresa);
		chamadoModel.aggregate(
		    [	
		    	{
		           "$match": {
		                //idEmpresa: empresa
		                dono: empresa
		            }
	        	},
				{ 
					"$group": { 
				       	_id: {nome: "$nomeAtendente"},
				       	total: { $sum: 1 } 
					}
				}
		    ],
		    function(err,result) {
		    	//console.log(result);
		    	res.status(201);
				res.send(result);
		    }
		);
	};



	
	var listarMediaTemposChamados = function(dono, req, res){
		//console.log('entrou na listagem de media de tempos');
		chamadoModel.aggregate(
	    [	{
	            "$match": {
	                dono: dono
	            }
        	},
			{ "$group": { 
		        "_id": {empresa: "$idEmpresa"},
		        "minutosAteAtribuir" : {$sum : "$minutosAteAtribuicao"},
		        "minutosAteIniciar" : {$sum : "$minutosDaAtribuicaoAteInicio"},
		        "minutosAteFichar" : {$sum : "$minutosDoInicioAteFinalizacao"},
	            "total": {$sum: 1}
			}}
	    ],
	    function(err,result) {
	    	//console.log(result);
	    	res.status(201);
			res.send(result);
	       // Result is an array of documents
	    }
		);
	};



	var listarResumoQtdChamadosUltimos = function(dono, req, res){
		//console.log('entrou na listagem de qtd ultimos dias');
		chamadoModel.aggregate(
	    [	
	    	{
	           "$match": {
	                dono: dono
	            }
        	},
			{ "$group": { 
		        "_id": 
	             {
	               	ano: {$year: "$dataCriacao"},
	               	mes: {$month: "$dataCriacao"},
	               	dia: {$dayOfMonth: "$dataCriacao"}
	             }, 
	             "total": {$sum: 1}
			}}
			//,
	        // Sorting pipeline
	        ,{ "$sort": {  "_id.ano": 1 , "_id.mes": 1 , "_id.dia": 1 } }
	        // Optionally limit results
	        ,{ "$limit": 15 }
	    ],
	    function(err,result) {
	    	//console.log(result);
	    	res.status(201);
			res.send(result);
	    }
		);
	};


	var listarResumoMediaAvaliacoesChamados = function(dono, req, res){
		//console.log('entrou na listarResumoMediaAvaliacoesChamados');
		chamadoModel.aggregate(
	    [	
	    	{
	           "$match": {
	                dono: dono
	            }
        	},
			{ 
				"$group": { 
		       	"_id": {empresa: "$idEmpresa"},
		        "mediaAvaliacaoAtendimento" : {$avg : "$avaliacaoAtendimento"}
			}}
	    ],
	    function(err,result) {
	    	//console.log(result);
	    	res.status(201);
			res.send(result);
	    }
		);
	};



	var listarAtendentesOcupadosPorRegiao = function(donoParametro, req, res){
		//console.log('entrou na listagem de atendentes ocupados por regiao');

		var query = [];
		query.push({dono : donoParametro});
		query.push({deletado : false});
		query.push({dataFim :  null});
		query.push({dataApoio :  {$ne: null }});

		var queryFinal = { $and: query };

		//console.log(queryFinal);

		chamadoModel.aggregate(
	    [	{
	            "$match": {dono : donoParametro}
        	},
        	 
			{ "$group": { 
		        "_id": {nomeRegiao: "$nomeRegiao", nomeAtendente : "$nomeAtendente"}
			}}
	    ],
	    function(err,result) {
	    	//console.log(result);
	    	res.status(201);
			res.send(result);
	    }
		);
	};



	var listarTotaisChamadosDia = function(donoChamado, data, req, res){
		//console.log('entrou na listagem de totais compilados de chamados por dia');
		
		var recuperarChamadosDoDia = function() {
		  	var deferred = q.defer();

		  	var query = [];
		  	if(!data){
		  		data = moment();
		  	}
		  	var dataInicioDia = moment(data, "DD-MM-YYYY");
		  	var dataFimDia = moment(data, "DD-MM-YYYY");; 
		  	dataFimDia.set({hour:23,minute:59,second:59,millisecond:99})
		  	
			query.push({dataCriacao : { $gte: dataInicioDia, $lt: dataFimDia }});
			query.push({deletado : false});
			query.push({dono : donoChamado});

			//console.log(query);
			var queryFinal = {};
			if(query && query.length > 0){
				queryFinal = { $and: query };
			}

			chamadoModel.find(queryFinal)
				.exec(function(err, chamados){
					//console.log('total chamados do dia: ',chamados.length);
					if(!err){
						var returnChamados = [];
						chamados.forEach(function(element, index, array){
							var chamadoObj = element.toJSON();
							chamadoObj.status = classificadorStatus(chamadoObj);
							returnChamados.push(chamadoObj);
						});

				  		deferred.resolve(returnChamados);
					}
				});

		  	return deferred.promise;
		};

		recuperarChamadosDoDia().then(function(chamados) {
			var returnCompilado = [];
			var totalAbertos = chamados.length;
			var totalEmAndamento = 0;
			var totalACaminho = 0;
			var totalFechados = 0;

			//console.log('chegou no nivel de agrupamento pr status');
			//console.log(chamados);

			chamados.forEach(function(element, index, array){

				var chamadoObj = element;
				//console.log(chamadoObj);
				if(chamadoObj.status == "Finalizado"){
	    			totalFechados++;	
	    		} else if(chamadoObj.status == "Em atendimento"){
	    			totalEmAndamento++
	    		} else if(chamadoObj.status == "A caminho"){
	    			totalACaminho++;
	    		} 
			});	

			returnCompilado.push({abertos : totalAbertos});
			returnCompilado.push({andamento : totalEmAndamento});
			returnCompilado.push({caminho : totalACaminho});
			returnCompilado.push({fechados : totalFechados});
			//console.log(returnCompilado);
			
			res.status(201);
			res.json(returnCompilado);

		});

	};



	var exportarChamado = function(req, res){
		//console.log(' ::: Exportar Chamados');
		
		var queryFinal = montarQueryListar(req);

		chamadoModel.find(queryFinal)
			.populate('itens').populate('idUnidade') 
			.exec(function(err, chamados){

				if(err){
					res.status(500).send(err);
				} else {

//					codigo,nomeRegiao,nomeSolicitante,cpfSolicitante,nomeAtendente,nomeUnidade,
//	nomeAgrupamento, nomeCategoria, itens, dataCriacao, dataApoio, dataInicioAtendimento, dataFim,
//	comentarioEncerramento, minutosAteAtribuicao,minutosDaAtribuicaoAteInicio,
//	minutosDoInicioAteFinalizacao, avaliacaoAtendimento
					
					var returnChamados = [];
					chamados.forEach(function(element, index, array){
						
							var chamadoObj = element.toJSON();
							
							var obj = {};
							obj.codigo = chamadoObj.codigo;
							obj.regiao = chamadoObj.nomeRegiao;
							obj.solicitante = chamadoObj.nomeSolicitante;
							obj.cpfSolicitante = chamadoObj.cpfSolicitante;
							obj.atendente = chamadoObj.nomeAtendente;
							obj.sala = chamadoObj.nomeUnidade;

							obj.predio = chamadoObj.nomeAgrupamento;
							obj.categoria = chamadoObj.nomeCategoria;
							if(chamadoObj.itens && chamadoObj.itens.length > 0){
								obj.itemAtendimento = chamadoObj.itens[0].nome;
							}
							obj.criadoEm = moment(chamadoObj.dataCriacao).utcOffset('-0300').format("DD/MM/YYYY HH:mm");
							obj.atribuidoEm = moment(chamadoObj.dataApoio).utcOffset('-0300').format("DD/MM/YYYY HH:mm");
							obj.inicioAtedimento = moment(chamadoObj.dataInicioAtendimento).utcOffset('-0300').format("DD/MM/YYYY HH:mm");
							obj.finalizadoEm = moment(chamadoObj.dataFim).utcOffset('-0300').format("DD/MM/YYYY HH:mm");

							obj.comentarioEncerramento = chamadoObj.comentarioEncerramento;
							obj.minutosAteAtribuicao = chamadoObj.minutosAteAtribuicao;
							obj.minutosDaAtribuicaoAteInicio = chamadoObj.minutosDaAtribuicaoAteInicio;
							obj.minutosDoInicioAteFinalizacao = chamadoObj.minutosDoInicioAteFinalizacao;
							obj.avaliacaoAtendimento = chamadoObj.avaliacaoAtendimento;

							returnChamados.push(obj);
			
					});

					res.xls('chamados.xlsx', returnChamados);
				}
			});
	};



	var montarQueryListar = function(req){

		var query = [];
		//console.log(moment().format()); 	
		if(req.query){
			//query = req.query;
			if(req.query.dataCriacao){
				query.push({dataCriacao : moment(query.dataCriacao, "DD/MM/YYYY").utc().format()});
			} 
			if(req.query.dataFim){
				query.push({dataFim : moment(query.dataFim, "DD/MM/YYYY").utc().format()});
			}

			if(req.query.dataCriacaoDe && query.dataCriacaoAte){
				query.push({
                    $gte: moment(query.dataCriacaoDe, "DD/MM/YYYY").hour(0).minute(0).second(0).millisecond(0).utc().format(),
                    $lte: moment(query.dataCriacaoAte, "DD/MM/YYYY").hour(23).minute(59).second(59).millisecond(999).utc().format()
                });
			}

			if(req.query.dataFimDe && query.dataFimAte){
				query.push({
                    $gte: moment(query.dataFimDe, "DD/MM/YYYY").hour(0).minute(0).second(0).millisecond(0).utc().format(),
                    $lte: moment(query.dataFimAte, "DD/MM/YYYY").hour(23).minute(59).second(59).millisecond(999).utc().format()
                });
			}


			if(req.query.idEmpresa){
				query.push({idEmpresa : req.query.idEmpresa});
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

		//console.log(query);
		var queryFinal = {};
		if(query && query.length > 0){
			queryFinal = { $and: query };
		}
		return queryFinal;
	}




	return {
		listarResumoCategoriasChamados : listarResumoCategoriasChamados,
		listarResumoItensAtendimentosPorCategoria : listarResumoItensAtendimentosPorCategoria,
		listarTotaisChamadosDia : listarTotaisChamadosDia,
		listarMediaTemposChamados : listarMediaTemposChamados,
		listarResumoQtdChamadosUltimos : listarResumoQtdChamadosUltimos,
		listarResumoMediaAvaliacoesChamados : listarResumoMediaAvaliacoesChamados,
		listarAtendentesOcupadosPorRegiao :listarAtendentesOcupadosPorRegiao,
		listarResumoQtdPorAtendente : listarResumoQtdPorAtendente,
		listarResumoQtdPorSolicitante : listarResumoQtdPorSolicitante,
		exportarChamado : exportarChamado
	};

};

module.exports = chamadoRelatorioController;