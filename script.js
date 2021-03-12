// global constants

const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence

//Global Variables
var pattern = [5, 5, 5, 5, 3, 5, 10, 5, 3, 3];
var progress = 0;
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5;
var guessCounter = 0;
var cluePauseTime = 200; //how long to pause in between clues
var clueHoldTime = 500; //how long to hold each clue's light/sound
var lives = 3;

function startGame() {
  //initialize game variables
  progress = 0;
  gamePlaying = true;
  cluePauseTime = 200;
  clueHoldTime = 500;
  lives = 3;
  playClueSequence();

  // swap the Start and Stop buttons
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
}

function stopGame() {
  gamePlaying = false;

  document.getElementById("stopBtn").classList.add("hidden");
  document.getElementById("startBtn").classList.remove("hidden");
}

// Sound Synthesis Functions
const freqMap = {
  1: 261.6, //c
  2: 277.2,
  3: 293.7,
  4: 311.1,
  5: 329.6,
  6: 349.2,
  7: 370.0,
  8: 392.0,
  9: 415.3,
  10: 440.0,
  11: 466.2,
  12: 493.9
};
function playTone(btn, len) {
  context.resume();
  o.frequency.value = freqMap[btn];
  g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
  tonePlaying = true;
  setTimeout(function() {
    stopTone();
  }, len);
}
function startTone(btn) {
  if (!tonePlaying) {
    o.frequency.value = freqMap[btn];
    g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
    tonePlaying = true;
  }
}
function stopTone() {
  g.gain.setTargetAtTime(0, context.currentTime + 0.05, 0.025);
  tonePlaying = false;
}

//Page Initialization
// Init Sound Synthesizer
var context = new AudioContext();
var o = context.createOscillator();
var g = context.createGain();
g.connect(context.destination);
g.gain.setValueAtTime(0, context.currentTime);
o.connect(g);
o.start(0);

function lightButton(btn) {
  document.getElementById("b" + btn).classList.add("lit");
}
function clearButton(btn) {
  document.getElementById("b" + btn).classList.remove("lit");
}

function playSingleClue(btn) {
  if (gamePlaying) {
    lightButton(btn);
    playTone(btn, clueHoldTime);
    setTimeout(clearButton, clueHoldTime, btn);
  }
}

function playClueSequence() {
  context.resume();
  guessCounter = 0;
  let delay = nextClueWaitTime; //set delay to initial wait time
  for (let i = 0; i <= progress; i++) {
    // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms");
    setTimeout(playSingleClue, delay, pattern[i]); // set a timeout to play that clue
    delay += clueHoldTime;
    delay += cluePauseTime;
  }
}

function loseGame() {
  stopGame();
  alert("you lost :[");
}

function winGame() {
  stopGame();
  alert("you won! congrats :]");
}

function guess(btn) {
  console.log("user guessed: " + btn);
  if (!gamePlaying) {
    return;
  }

  if (btn == pattern[guessCounter]) {
    if (guessCounter == progress) {
      if (progress == pattern.length - 1) {
        winGame();
      } else {
        progress++;
        if (clueHoldTime != 120) clueHoldTime -= 10;
        if (cluePauseTime != 80) cluePauseTime -= 20;
        playClueSequence();
      }
    } else {
      guessCounter++;
    }
  } else {
    lives--;
    if (lives > 0) alert("oh no, try again! you have " + lives + " lives left");
    if (lives == 0) loseGame();
    playClueSequence();
  }
}
