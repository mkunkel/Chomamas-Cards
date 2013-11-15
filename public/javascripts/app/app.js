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
  $('#whites').on('click', '.white', clickWhite);
  $('#submissions').on('click', '.submission', clickSubmission);
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

function displayCard(number, cardUrl, imageWidth, imageHeight, columns, rows) {
  // var cardUrl = '../images/cards.png';
  // // get card size
  // var imageWidth = 950;
  // var imageHeight = 392;
  // var columns = 13;
  // var rows = 4;
  var cardWidth = Math.floor(imageWidth / columns);
  var cardHeight = Math.floor(imageHeight / rows);
  number = number - 1;


  // find card
  var cardRow = Math.floor(number / columns);
  var cardColumn = number % columns;
  var leftPosition = imageWidth - Math.floor((cardColumn * cardWidth));
  var topPosition = imageHeight - (Math.floor(cardRow * cardHeight));


  return $('div')
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
  socket.on('allSubmissions', socketRenderAllSubmissions);
  socket.on('newTurn', socketRenderGame);
  socket.on('winner', socketGameOver);
}

function socketGameOver(data){
  //alert(player.name + ' is the winner. Chomama says the rest of yall suck.');
}

function socketRenderAllSubmissions(data){
  var $black = displayCard(number, '../images/blackcards.jpg', imageWidth, imageHeight, columns, rows);
  $black.attr('id', 'blackCard');
  $('#black').empty().append($black);

  for(var i = 0; i < 7; i++){
    var $white = displayCard(number, '..images/whitecards.jpg', imageWidth, imageHeight, columns, rows);
    $white.addClass('white').addClass('float').data('index', number);
    $('#whites').append($white);
  }
  for(var i = 0; i < game.submissions.length; i++){
    var $submission = displayCard(number, '..images/whitecards.jpg', imageWidth, imageHeight, columns, rows);
    $submission.addClass('submission').addClass('float').data('index', number);
    $('#submissions').append($submission);
  }
}

function socketConnected(data){
  console.log(data);
}

function socketRenderGame(data) {
  // call displayCard function for jquery black
  game = data.game;
  var $black = displayCard(number, '../images/blackcards.jpg', 2866, 716, 20, 5);
  $black.attr('id', 'blackCard');
  $('#black').empty().append($black);

  $('#whites').empty;
  for(var i = 0; i < 7; i++){
    var $white = displayCard(number, '..images/whitecards.jpg', 2292, 3578, 16, 25);
    $white.addClass('white').addClass('float').data('index', number);
    $('#whites').append($white);
  }
}

function clickWhite(){
  if(game.reader.name === player){
    alert('you are the reader, stupid!');
  }else{
    var submission = $(this).data('index');
    socket.emit('whiteSubmission', {game: game, player: player, submission: submission});
    $('.white').hide();
  };
}

function clickSubmission(){
  if(game.reader.name !== player){
      alert('you are NOT the reader, stupid!');
    }else{
      var winnningCard = $(this).data('index');
      socket.emit('winningCard', {game: game, player: player, winningCard: winningCard});
      $('.submission').hide();
  };
}
