"use strict";

export default class Sound {
  constructor() {
    this.background_audio = document.querySelector("audio");
    this.play_state = false;
    // this.url = "";
    // this.carrot_pull_sound = "./sound/carrot_pull.mp3";
    // this.bug_touch_sound = "./sound/bug_pull.mp3";
  }

  play_bg_sound = () => {
    this.background_audio.play();
  };

  pause_bg_sound = () => {
    this.background_audio.pause();
  };

  check_bg_running = (running_sound) => {
    if (running_sound !== undefined) {
      running_sound
        .then(function () {
          // Automatic playback started!
        })
        .catch(function (error) {
          // Automatic playback failed.
          // Show a UI element to let the user manually start playback.
        });
    }
  };

  play_sounds = (url) => {
    new Audio(url).play();
  };

  // create_audio_context = () => {
  //   const audioContext = new AudioContext();
  // };

  // resume_bg_sound = (audioContext) => {
  //   audioContext.resume();
  //   // this.audioContext.resume();
  // };
}
