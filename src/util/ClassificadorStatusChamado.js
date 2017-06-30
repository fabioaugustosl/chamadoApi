
var ClassificadorStatusChamado = (function (chamado) {
    var classificar = function(chamado){

    	if(chamado){
    		if(chamado.dataFim){
    			return "Finalizado";
    		} else if(chamado.dataInicioAtendimento){
    			return "Em atendimento";
    		} else if(chamado.dataApoio){
    			return "A caminho";
    		} else {
    			return "Aberto";
    		}
    	}
	};

    return function (chamado){ return classificar(chamado)};
})();

module.exports = ClassificadorStatusChamado;