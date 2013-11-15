var mongoose = require('mongoose');
var __ = require('lodash');

function randomize() {
  return (__.sample(__.range(10)))-1;
}

var Player = mongoose.Schema({
  name:      String,
  socketId:  String,
  isDealer:  {type: Boolean, default: false},
  createdAt: {type: Date, default: Date.now}
});

Player.pre('save', function(next){
  if(this.x < 0) {this.x = 0;}
  if(this.x > 9) {this.x = 9;}
  if(this.y < 0) {this.y = 0;}
  if(this.y > 9) {this.y = 9;}
  next();
});

mongoose.model('Player', Player);