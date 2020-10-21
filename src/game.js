"use strict";
// import Field from "./field.js";
import Popup from "./popup.js";
import Sound from "./sound.js";
// import Field from "./field.js";

export default class Game {
  constructor() {
    this.timer_span = document.querySelector(".timer");
    this.timer_text = document.querySelector(".timer >span");
    this.play_btn = document.querySelector(".play");
    this.carrot_number_span = document.querySelector(".count >span");
    // 카운터 작동 여부
    this.counter_working = false;
    // 일시정지 여부
    this.is_paused = false;
    // 카운트다운을 하는 카운터 객체
    this.counter = null;
    this.speed = 0.5;

    this.level = 0;
    this.time_counts = [11];
    // this.carrot_counts = [10, 15];
    // this.bug_counts = [10, 15];
    this.obj_counts = [10, 15];

    this.count = this.time_counts[this.level];
    this.carrot_count = this.obj_counts[this.level];
    this.bug_count = this.obj_counts[this.level];
    // this.bug_counts = [10, 15];
    // this.carrot_count = this.carrot_counts[this.level];
    // this.bug_count = this.bug_counts[this.level];

    this.game_finish_banner = new Popup();
    this.sound_effect = new Sound();

    // this.field = new Field();
    // this.count = this.field.level_counts[this.field.level];
    // this.carrot_count = this.field.obj_counts[this.field.level];

    // this.background_audio = document.querySelector("audio");
  }

  // 게임이 실패인지 종료인지 확인하는 함수
  check_game_end = () => {
    console.group("check_game_end");
    let url = "";
    // const background_audio = document.querySelector("audio");

    if (this.carrot_count === 0) {
      // alert("게임성공!");
      // replay 모달창을 보여준다.
      clearInterval(this.counter);
      this.counter_working = false;

      url = "./sound/game_win.mp3";

      this.game_finish_banner.show_with_text("YOU WON!");

      this.sound_effect.background_audio.pause();
      this.sound_effect.background_audio.currentTime = 0;
      // play_state = false;

      // 당근 개수가 남아있으면 게임 실패
    } else if (this.count <= 0 && this.carrot_count !== 0) {
      url = "./sound/alert.wav";

      this.game_finish_banner.show_with_text("GAME OVER");

      clearInterval(this.counter);
      this.counter_working = false;
      this.sound_effect.background_audio.pause();
      this.sound_effect.background_audio.currentTime = 0;
      // play_state = false;
    } else if (this.bug_count !== 10) {
      url = "./sound/alert.wav";

      // alert("game over");
      // replay 모달창을 보여준다.
      clearInterval(this.counter);
      this.counter_working = false;

      // document.querySelector(".modal > span").innerText = "GAME OVER";
      // document.querySelector(".modal").classList.remove("hidden");
      this.game_finish_banner.show_with_text("GAME OVER");

      this.sound_effect.background_audio.pause();
      this.sound_effect.background_audio.currentTime = 0;
      // play_state = false;
    }

    const sound_effect_play = new Audio(url).play();
    this.sound_effect.check_bg_running(sound_effect_play);

    console.groupEnd();
  };

  clear_timer_warning = () => {
    console.log("clear");

    if (this.timer_span.classList.contains("warning")) {
      this.timer_span.classList.remove("warning");
    }
  };

  set_time = (left_counts) => {
    this.clear_timer_warning();
    let left_time = Math.floor(left_counts / 60) + ":" + (left_counts % 60);
    if (left_counts < 10) {
      // 시간이 얼마 남지 않았으므로 빨간색 백그라운드 효과를 준다.
      this.timer_span.classList.add("warning");
    }
    this.timer_text.innerText = left_time;
  };

  // timer 함수
  timer = () => {
    if (!this.is_paused) this.count--;

    this.set_time(this.count);

    // 타이머 종료
    if (this.count <= 0) {
      clearInterval(this.counter);

      // 게임 결과 체크
      if (this.counter_working) this.check_game_end();
      this.counter_working = false;
    }
  };

  set_play_btn_play = () => {
    // play로 버튼 모양 다시 바꾼다.
    document.querySelector(".play").innerHTML =
      '<i class="fas fa-play"></i> play';
  };
  set_play_btn_pause = () => {
    // play버튼을 스탑버튼으로 변경한다.
    this.play_btn.innerHTML = '<i class="fas fa-pause"></i> pause';
  };

  // 게임 시작 함수
  game_start = () => {
    this.set_play_btn_pause();

    this.counter_working = true;
    this.is_paused = false;
    this.sound_effect.play_state = true;

    this.counter = setInterval(this.timer, 1000);
  };

  // 게임 일시정지 함수
  game_pause = () => {
    // console.log("game_pause");
    this.set_play_btn_play();

    this.is_paused = true;
    this.counter_working = false;
    this.sound_effect.play_state = false;
  };

  // 게임 재게 함수
  game_resume = () => {
    this.set_play_btn_pause();
    this.is_paused = false;
    this.counter_working = true;
    this.sound_effect.play_state = true;
    // this.sound_effect.resume_sounds();
  };

  // 게임 재시작 시 기존 정보들 리셋하는 함수
  reset_game_setting = () => {
    // 변수값 리셋
    this.count = this.time_counts[this.level];
    this.carrot_count = this.obj_counts[this.level];
    this.bug_count = this.obj_counts[this.level];

    // const carrot_number_span = document.querySelector(".count > span");
    this.carrot_number_span.innerText = this.carrot_count;
    this.set_time(this.count);
  };

  // 이벤트 객체 클릭 시 발생하는 함수
  counting = (target) => {
    console.group("counting");

    let url = "";

    const carrot_number_span = document.querySelector(".count > span");

    target = String(target);

    if (this.counter_working === false || this.is_paused) return;

    if (target.includes("carrot")) {
      // if (String(target).includes("carrot")) {
      // if (target.getAttribute("class") === "carrot") {
      // console.log("당근클릭");
      // 음향효과
      url = "./sound/carrot_pull.mp3";
      // this.sound_effect.play_sounds();
      const remove_item = document.querySelector("#" + target);
      remove_item.remove();

      this.carrot_count--;
      carrot_number_span.innerText = this.carrot_count;
    } else if (target.includes("bug")) {
      // 음향효과
      url = "./sound/bug_pull.mp3";
      this.bug_count--;
      // console.log("this.bug_count: ", this.bug_count);
    }

    this.sound_effect.play_sounds(url);
    // new Audio(url).play();
    // const sound_effect_play = new Audio(url).play();

    this.check_game_end();

    console.groupEnd();
  };
}
