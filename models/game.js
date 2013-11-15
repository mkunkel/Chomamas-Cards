var mongoose = require('mongoose');
var __ = require('lodash');

function randomize() {
  return __.sample(__.range(10));
}

var Game = mongoose.Schema({
  name:      String,
  players:   [{type: mongoose.Schema.Types.ObjectId, ref: 'Player'}],
  submissions: [],
  whiteCards: [Number],
  blackCards: [Number]
});


Game.pre('save', function(next){
  next();
});

mongoose.model('Game', Game);

