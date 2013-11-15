var mongoose = require('mongoose');
var __ = require('lodash');

function randomize() {
  return (__.sample(__.range(10)))-1;
}

var Player = mongoose.Schema({
  name:      String,
  socketId:  String,
  isReader:  {type: Boolean, default: false},
  whiteCards: [Number],
  blackCards: Number,
  score:      {type: Number, default: 0}
});

Player.pre('save', function(next){
  next();
});

mongoose.model('Player', Player);