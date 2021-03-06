var express = require('express');
var bodyParser = require('body-parser');
//var cookieParser = require('cookie-parser');
//var session = require('express-session');
var mongoose = require('mongoose');
var json2xls = require('json2xls');



var app = express();

var db = mongoose.connect('mongodb://localhost/db_chamados');


var port = process.env.PORT || 3000;

// diretorios publicos
app.use(express.static('public'));


//middlaware
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(json2xls.middleware); //exportação xls


// cors
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

//app.set('views','./src/views');


//rotas
var chamadoRouter = require('./src/routes/ChamadoRoutes');
var chamadoUtilRouter = require('./src/routes/ChamadoUtilRoutes');
var chamadoInfoRouter = require('./src/routes/ChamadoInfoRoutes');
var regiaoRouter = require('./src/routes/RegiaoRoutes');
var agrupamentoRouter = require('./src/routes/AgrupamentoRoutes');
var unidadeRouter = require('./src/routes/UnidadeRoutes');
var empresaRouter = require('./src/routes/EmpresaRoutes');
var parametroRouter = require('./src/routes/ParametroGeralRoutes');
var categoriaRouter = require('./src/routes/CategoriaRoutes');
var itemRouter = require('./src/routes/ItemAtendimentoRoutes');
var apoioRouter = require('./src/routes/ApoioRoutes');
var notificacaoRouter = require('./src/routes/NotificacaoRoutes');
var autorizadoRouter = require('./src/routes/SolicitanteAutorizadoRoutes');
var loginRouter = require('./src/routes/LoginRoutes');

app.use('/api/chamado/v1', chamadoRouter);
app.use('/api/chamadoUtil/v1', chamadoUtilRouter);
app.use('/api/regiao/v1', regiaoRouter);
app.use('/api/agrupamento/v1', agrupamentoRouter);
app.use('/api/unidade/v1', unidadeRouter);
app.use('/api/empresa/v1', empresaRouter);
app.use('/api/parametro/v1', parametroRouter);
app.use('/api/categoria/v1', categoriaRouter);
app.use('/api/item/v1', itemRouter);
app.use('/api/apoio/v1', apoioRouter);
app.use('/api/notificacao/v1', notificacaoRouter);
app.use('/api/chamadoInfo/v1', chamadoInfoRouter);
app.use('/api/autorizado/v1', autorizadoRouter);
app.use('/api/login/v1', loginRouter);




app.get('/', function(req, res){
	//res.render('index');
	res.send('de buenas Chamado');
	console.log('de buenas Chamado');
});

// start servidor
app.listen(port, function(err){
	console.log('running chamado on '+port);
});


module.exports = app;

