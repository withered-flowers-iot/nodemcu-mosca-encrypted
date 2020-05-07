'use strict';

var fs   = require('fs');

/*
var http = require('http');
var https= require('https');
*/

var myKeyPath = 'cert/selfsigned/key.pem';
var myCertPath= 'cert/selfsigned/cert.pem';

var myKey = fs.readFileSync(myKeyPath);
var myCert = fs.readFileSync(myCertPath);

var mosca = require('mosca');
var moscaServer = new mosca.Server({
  port:3004,
  secure:{
    port:3005,
    keyPath:myKeyPath,
    certPath:myCertPath
  }
});

/*
var express = require('express');
var app = express();
*/

/*
var httpsOption = {
  key: myKey,
  cert: myCert
};

app.use('/', function(req, res) {
  res.end('Welcome to my web !');
});

var myHttpServer = http.createServer(app).listen(3001, '0.0.0.0');
var myHttpsServer= https.createServer(httpsOption, app).listen(3002, '0.0.0.0');
*/

moscaServer.on('clientConnected', function(client) {
  console.log('Client connected', client.id, '\n');
});

moscaServer.on('clientDisconnected', function(client) {
  console.log('Client disconnected', client.id, '\n');
});

moscaServer.on('published', function(packet, client) {
  var packetTopicOverhead = packet.topic.substring(0,4);

  if(packetTopicOverhead !== "$SYS" ) {
    console.log(
      'Published From topic:', 
      packet.topic, 
      'with message:', 
      packet.payload.toString(), 
      'From client', client.id);
  }
});

moscaServer.on('ready', setup);

// fired when the mqtt server is ready
function setup() {
  console.log('Mosca server is up and running\n');
}
/*
moscaServer.attachHttpServer(myHttpServer);
moscaServer.attachHttpServer(myHttpsServer);
*/