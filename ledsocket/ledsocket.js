var five = require("johnny-five");
var rgbHex = require('rgb-hex');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var board = five.Board();

var color = {
  red: 255,
  blue: 0,
  green: 0
};


var getRGBColor = function() {
  return '#' + rgbHex(color.red,color.blue,color.green);
};

board.on("ready", function() {

  // Initialize the RGB LED
  var led = new five.Led.RGB({
    pins: {
      red: 6,
      green: 3,
      blue: 5
    }
  });

  // Add led to REPL (optional)
  this.repl.inject({
    led: led
  });


  led.on();
  led.color(getRGBColor());

  led.blink(1000);

  server.listen(8080);

  app.get('/vue.js',function(req,res) {
    res.sendFile(__dirname + '/node_modules/vue/dist/vue.js');
  });

  app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
  });

  io.on('connection', function (socket) {
    socket.emit('color updated', color);
    socket.on('update color', function (newColor) {
      color = newColor;
      socket.emit('color updated', color);
      led.color(getRGBColor());
    });
  });

});
