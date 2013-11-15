var mongoose = require('mongoose');
var __ = require('lodash');
var Game = mongoose.model('Game');
var Player = mongoose.model('Player');

exports.findGame = function(name, fn){
  Game.findOne({name:name}).populate('players').exec(function(err, game){

    fn(err, game);
  });
};

exports.newGame = function(name, fn){
  new Game({name:name}).save(function(err, game){
    Game.findById(game.id).populate('players').exec(function(err, game){
      fn(err, game);
    });
  });
};

exports.findPlayer = function(name, fn){
  Player.findOne({name:name}, function(err, player){
    fn(err, player);
  });
};

exports.newPlayer = function(name, color, fn){
  new Player({name:name, color:color}).save(function(err, player){
    fn(err, player);
  });
};

exports.resetPlayer = function(player, socket, fn){
  player.socketId = socket.id;
  player.save(function(err, player){
    fn(err, player);
  });
};

exports.incrementTurn = function(game, fn) {
  game.turn++;
  game.save(function(err, game) {
    fn(err, game);
  });
}

exports.resetSubmissions = function(game, fn) {
  if (game.submissions.length === game.players.length - 1) {
    game.submissions = [];
  }
  game.save(function(err, game) {
    fn(err, game);
  });
}

exports.removeCard = function(player, cards, submission, fn) {
  player[cards].splice(submission, 1);
  player.save(function(err, player) {
    fn(err, player);
  });
};

exports.popCard = function(game, cards, fn) {
  var card = game[cards].pop();
  game.save(function(err, game) {
    fn(err, card);
  });
};

exports.pushCard = function(player, cards, card, fn) {
  player[cards].push(card, 1);
  player.save(function(err, player) {
    fn(err, player);
  });
};

exports.attachPlayer = function(game, player, fn){
  game.players.push(player);
  game.save(function(err, game){
    fn(err, game);
  });
};

exports.emitGame = function(sockets, players, game, fn){
  for(var i = 0; i < players.length; i++){
    if(sockets[players[i].socketId]){
      sockets[players[i].socketId].emit('renderGame', {players:players, game:game});
    }
  }
  fn();
};