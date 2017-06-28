
var QRCode = require('qrcode')

// /qr("Xupa Galo!", function(txt){ res.send(txt); });
var QRCodeUtil = (function (texto, cb) {
    var gerarQRCodePNG = function(texto, cb){
    	console.log("Texto recebido para gerar o qrcode: ",texto);
		QRCode.toDataURL(texto, function (err, url) {
			console.log("gerou", url);
			cb(url);
		});
	}

    return function (texto, cb){ return gerarQRCodePNG(texto, cb)};
})();


module.exports = QRCodeUtil;


	/*
	 *** Documentation QRCode API

	 QRCode.draw(text, [optional options], cb(error, canvas));
Returns a node canvas object see https://github.com/Automattic/node-canvas for all of the cool node things you can do. Look up the canvas api for the other cool things.

QRCode.toDataURL(text, [optional options], cb(error, dataURL));
Returns mime image/png data url for the 2d barcode.

QRCode.drawSvg(text, [optional options], cb(error, svgString));
SVG output!

QRCode.save(path, text, [optional options], cb(error, written));
Saves png to the path specified returns bytes written.

QRCode.drawText(text, [optional options], cb)
Returns an ascii representation of the qrcode using unicode characters and ansi control codes for background control.

QRCode.drawBitArray(text, [optional options], cb(error, bits, width));
Returns an array with each value being either 0 light or 1 dark and the width of each row. This is enough info to render a qrcode any way you want. =)

Options

errorCorrectLevel
Can be one of the values in qrcode.errorCorrectLevel.
Can be a string, one of "minimum", "medium", "high", "max"


*/
