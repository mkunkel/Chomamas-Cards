var mongoose = require('mongoose');
var Game = mongoose.model('Game');
var __ = require('lodash');

function randomize() {
  return (__.sample(__.range(10)))-1;
}

var Player = mongoose.Schema({
  name:      String,
  socketId:  String,
  whiteCards: [Number],
  blackCards: Number,
  score:      {type: Number, default: 0}
});

Player.pre('save', function(next){
  if(!this.whiteCards.length) {
    // populate hand
    // Game.where()
  }
  next();
});

mongoose.model('Player', Player);