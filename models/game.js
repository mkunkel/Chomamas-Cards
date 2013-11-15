var mongoose = require('mongoose');
var __ = require('lodash');

function randomize() {
  return __.sample(__.range(10));
}

var Game = mongoose.Schema({
  name:      String,
  players:   [{type: mongoose.Schema.Types.ObjectId, ref: 'Player'}],
  reader:   {type: mongoose.Schema.Types.ObjectId, ref: 'Player'},
  submissions: [],
  turn:       {type: String, default: 0},
  whiteCards: [Number],
  blackCards: [Number]
});


Game.pre('save', function(next){
  if(!this.whiteCards.length) {
    var numOfWhite = 300;
    var numOfBlack = 100;
    var removeFromBlack = [];

    // Game just started, build decks
    this.whiteCards = __.shuffle(__.range(numOfWhite));
    this.blackCards = __.range(numOfBlack);
    for(var i = 0; i < removeFromBlack.length; i++) {
      this.blackCards.splice(i, 1);
    }
    this.blackCards = __.shuffle(this.blackCards);
  }

  // set reader
  this.reader = this.players[this.turn % this.players.length];

  next();
});

mongoose.model('Game', Game);

