"use strict";

export default class Sound {
  constructor() {
    this.background_audio = document.querySelector("audio");
    this.play_state = false;
    // this.url = "";
    this.carrot_pull_sound = "./sound/carrot_pull.mp3";
    this.bug_touch_sound = "./sound/bug_pull.mp3";
    this.audioContext = null;
  }

  control_bg_sound = () => {
    const audioContext = new AudioContext();
    this.audioContext = audioContext;
    // 오디오가 중지상태라면
    if (this.audioContext.state === "suspended") {
      // 실행 상태로 변경
      this.audioContext.resume();
    }
    // this.play_state = !this.play_state;
    if (this.play_state) {
      const background_audio_play = this.play_bg_sound();
      // this.check_bg_running(background_audio_play);
    } else {
      this.pause_bg_sound();
    }
  };

  play_bg_sound = () => {
    this.background_audio.play();
  };

  pause_bg_sound = () => {
    this.background_audio.pause();
  };

  resume_bg_sound = () => {
    this.audioContext.resume();
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

  play_bug_sounds = () => {
    new Audio(this.bug_touch_sound).play();
  };
  play_carrot_sounds = () => {
    new Audio(this.carrot_pull_sound).play();
  };

  // create_audio_context = () => {
  //   const audioContext = new AudioContext();
  // };
}
