var mongoose = require('mongoose');
var __ = require('lodash');

var Game = mongoose.Schema({
  name:      String,
  players:   [{type: mongoose.Schema.Types.ObjectId, ref: 'Player'}],
  createdAt: {type: Date, default: Date.now}
});


function randomize() {
  return __.sample(__.range(10));
}

Game.pre('save', function(next){

});

mongoose.model('Game', Game);

