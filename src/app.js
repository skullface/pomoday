/* DOM elements */
const clock = document.querySelector('.clock');
const sessionToggle = document.getElementById('session-control');
const volumeSlider = document.getElementById('volume-slider');
const sessionCounter = document.getElementById('counter');
const soundSelect = document.getElementById('sound-effect');

/* Setup the YouTube iFrame API */
let player;
window.onYouTubeIframeAPIReady = function() {
  player = new YT.Player('player', {
    height: '1',
    width: '1',
    videoId: 'jfKfPfyJRdk',
    playerVars: {
      'playsinline': 1,
      'color': 'white',
      'controls': 0,
      'enablejsapi': 1,
      'origin': 'https://pomodoro.day' 
    },
    events: {
      'onReady': onPlayerReady
    }
  });
};

/* Ready the YouTube player */
function onPlayerReady(event) {
  player.setVolume(100); // Set the initial volume to 100%
  updateVolumeControls();
}

/* Update clock display */
let timer = null;
let workDuration = 25 * 60;
let breakDuration = 5 * 60;
let time = workDuration;

function updateClock() {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  clock.textContent = formattedTime;

  if (timer) {
    document.title = `${formattedTime} · lo-fi aesthetic pomodoro timer`;
  } else {
    document.title = "lo-fi aesthetic pomodoro timer · study, co-work, vibe"
  }
}

/* Control sessions */
let isBreak = false;

// Setup sessions
function toggleTimer() {
  if (timer) {
    clearInterval(timer);
    timer = null;
    sessionToggle.textContent = isBreak ? '▶ Resume break' : '▶ Resume session';
    if (player && typeof player.pauseVideo === 'function') {
      player.pauseVideo();
    }
  } else {
    timer = setInterval(countdown, 1000);
    sessionToggle.textContent = isBreak ? '⏸︎ Pause break' : '⏸︎ Pause session';
    if (player && typeof player.playVideo === 'function') {
      player.playVideo();
    }
  }
}

// Setup clock countdown
function countdown() {
  if (time > 0) {
    time--;
    updateClock();
    if (time === 1) {
      playSoundEffect(); // Play sound effect when 1 sec remains
    }
  } else {
    clearInterval(timer);
    timer = null;
    endSession();
  }
}

// Start work session
function startWorkSession() {
  time = workDuration;
  isBreak = false;
  startTimer();
  if (player && typeof player.playVideo === 'function') {
    player.playVideo(); // Play video during regular session
  }
}

// Start break session
function startBreakSession() {
  time = breakDuration;
  isBreak = true;
  startTimer();
  if (player && typeof player.pauseVideo === 'function') {
    player.pauseVideo(); // Pause video during break
  }
}

// Start countdown
function startTimer() {
  timer = setInterval(countdown, 1000);
  sessionToggle.textContent = isBreak ? '⏸︎ Pause break' : '⏸︎ Pause session';
  if (player && typeof player.playVideo === 'function') {
    player.playVideo();
  }
}

/* Update session counter */
let completedSessions = 1;

function updateSessionCounter() {
  sessionCounter.textContent = completedSessions;
}

/* End session (prepare to start new session) */
function endSession() {
  if (isBreak) {
    sessionToggle.textContent = '▶ Start session';
    completedSessions++;
    updateSessionCounter();
    time = workDuration;
  } else {
    time = breakDuration;
    sessionToggle.textContent = '▶ Start break';
  }
  updateClock();
  if (player && typeof player.pauseVideo === 'function') {
    player.pauseVideo();
  }
}

/* Listen for clicks on the session control button */
sessionToggle.addEventListener('click', function() {
  if (timer) {
    toggleTimer();
  } else {
    if (sessionToggle.textContent.includes('▶ Start session')) {
      startWorkSession();
    } else if (sessionToggle.textContent.includes('▶ Start break')) {
      startBreakSession();
    }
    else if (sessionToggle.textContent.includes('Resume')) {
      toggleTimer();
    }
  }
});

/* Control YouTube player volume */
volumeSlider.addEventListener('input', function() {
  player.setVolume(volumeSlider.value);
});

// Update YouTube player audio controls
function updateVolumeControls() {
  if (player.isMuted() || player.getVolume() === 0) {
    volumeSlider.value = 0;
  } else {
    volumeSlider.value = player.getVolume();
  }
}

/* Ding the timer sound effect */
const buzzSoundEffect = require('url:./assets/audio/buzz.mp3');
const chimeSoundEffect = require('url:./assets/audio/chime.mp3');
const dingSoundEffect = require('url:./assets/audio/ding.mp3');
const doorbellSoundEffect = require('url:./assets/audio/doorbell.mp3');
const gameShowSoundEffect = require('url:./assets/audio/game-show.mp3');
const harpSoundEffect = require('url:./assets/audio/harp.mp3');
const magicalGirlSoundEffect = require('url:./assets/audio/mahou-shoujo.mp3');

function playSoundEffect() {
  const soundSelected = soundSelect.value;
  let soundEffect;
  
  switch (soundSelected) {
    case 'buzz':
      soundEffect = new Audio(buzzSoundEffect);
      break;
    case 'chime':
      soundEffect = new Audio(chimeSoundEffect);
      break;
    case 'ding':
      soundEffect = new Audio(dingSoundEffect);
      break;
    case 'doorbell':
      soundEffect = new Audio(doorbellSoundEffect);
      break;
    case 'gameShow':
      soundEffect = new Audio(gameShowSoundEffect);
      break;
    case 'harp':
      soundEffect = new Audio(harpSoundEffect);
      break;
    case 'magicalGirl':
      soundEffect = new Audio(magicalGirlSoundEffect);
      break;
    case 'none':
      return;
    default:
      soundEffect = new Audio(buzzSoundEffect);
  }

  if (soundEffect) {
    soundEffect.play();
  }
}

soundSelect.addEventListener('change', function() {
  playSoundEffect();
});

/* Initialize clock /*/
updateClock();

/* Apply dark theme based on time of day */
function nightMode() {
  const now = new Date();
  const currentHour = now.getHours();

  if (currentHour >= 17) { // 5pm
    document.documentElement.classList.add('night');
  } else {
    document.documentElement.classList.remove('night');
  }
}

document.addEventListener('DOMContentLoaded', function() {
  nightMode();
});
