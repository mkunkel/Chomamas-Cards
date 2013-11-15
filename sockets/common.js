var async = require('async');
var __ = require('lodash');
var m = require('../lib/mechanics');
var io;

exports.connection = function(socket){
  io = this;
  socket.emit('connected', {status: 'connected'});
  socket.on('disconnect', socketDisconnect);
  socket.on('startgame', socketStartGame);
  socket.on('whiteSubmission', socketReceiveSubmission);
};

function socketReceiveSubmission(data){
  console.log(data);
  var storage = {};
  var socket = this;

  async.waterfall([
    function(fn){m.findGame(data.game,fn);},
    function(game,fn){storage.game=game;fn();},
    function(fn){m.resetSubmissions(storage.game, fn);},
    function(fn){m.findPlayer(data.player,fn);},
    function(player,fn){storage.player=player;fn();},
    function(fn){m.removeCard(storage.player, 'whiteCards', data.submission, fn);},
    function(player,fn){storage.player=player;fn();},
    //game.player.whites.splice(card index, 1);
    function(fn){m.popCard(storage.game, 'whiteCards', fn);},
    function(card, fn){m.pushCard(storage.player, 'whiteCards', card, fn);},
    //game.player.whiteCards.push(game.whiteCards.pop);
    function(game,fn){m.findGame(data.game,fn);},
    function(game,fn){m.emitGame(io.sockets, game, fn);}
  ]);
}

function socketStartGame(data){
  var storage = {};
  var socket = this;

  async.waterfall([
    function(fn){m.findGame(data.game,fn);},
    function(game,fn){if(!game){m.newGame(data.game,fn);}else{fn(null,game);}},
    function(game,fn){storage.game=game;fn();},
    function(fn){m.findPlayer(data.player,fn);},
    function(player,fn){if(!player){m.newPlayer(data.player,data.color,fn);}else{fn(null,player);}},
    function(player,fn){m.resetPlayer(player,socket,fn);},
    function(player,fn){storage.player=player;fn();},
    function(fn){fn(null,__.any(storage.game.players,function(p){return p.id===storage.player.id;}));},
    function(isFound,fn){if(!isFound){m.attachPlayer(storage.game,storage.player,fn);}else{fn(null,storage.game);}},
    function(game,fn){m.findGame(data.game,fn);},
    function(game,fn){m.emitGame(io.sockets, game, fn);}
  ]);
}

function socketDisconnect(data){
  console.log(data);
}