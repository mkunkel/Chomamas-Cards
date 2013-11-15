/* global _, getValue, document, alert, window, io */

$(document).ready(initialize);

var socket;
var player;
var game;
var players = [];

function initialize(){
  $(document).foundation();
  initializeSocketIO();
  $('#start').on('click', clickStart);
  $('#whites').on('click', 'white', clickWhite);
}

function findPlayer(){
  return _.find(players, function(p){return p.name === player;});
}

function clickStart() {
  player = getValue('#player');
  game = getValue('#name');
  $('#form').remove();
  // $('#game').show();
  socket.emit('startgame', {player: player, game: game});
}

function displayCard(number) {
  var cardUrl = '../images/cards.png';
  // get card size
  var imageWidth = 950;
  var imageHeight = 392;
  var columns = 13;
  var rows = 4;
  var cardWidth = Math.floor(imageWidth / columns);
  var cardHeight = Math.floor(imageHeight / rows);
  number = number - 1;


  // find card
  var cardRow = Math.floor(number / columns);
  var cardColumn = number % columns;
  var leftPosition = imageWidth - Math.floor((cardColumn * cardWidth));
  var topPosition = imageHeight - (Math.floor(cardRow * cardHeight));

  console.log('top:' + Math.floor((cardRow * cardHeight)) + ' left:' + Math.floor((cardColumn * cardWidth)));
  $('#card')
    .css('background-image', 'url("' + cardUrl + '")')
    .css('height', cardHeight)
    .css('width', cardWidth)
    .css('background-position',  leftPosition + 'px ' + topPosition + 'px')
    .data('index', number);
}


function initializeSocketIO(){
  var port = window.location.port ? window.location.port : '80';
  var url = window.location.protocol + '//' + window.location.hostname + ':' + port + '/app';

  socket = io.connect(url);
  socket.on('connected', socketConnected);
  socket.on('renderGame', socketRenderGame);

}

function socketConnected(data){
  console.log(data);
}

function socketRenderGame(data) {
  // call displayCard function for jquery black
  //does the table auto update?
  for(var i = 0; i < 7; i++){
    var $white = $('<div class="white"></div>');
    $white.addClass('float');
    $('#whites').append($white);
  }
}

function clickWhite{
  if(game.player.isReader){
    alert('you are the reader, stupid!');
  }else{
    var submission = $(this).data('index');
    socket.emit('whiteSubmission', {game: game, player: player, submission: submission});
    $('.white').hide();
  };
}
