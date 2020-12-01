"use strict";

import Popup from "./popup.js";
import Field from "./field.js";
import Sound from "./sound.js";
// import Game from "./game.js";
import GameBuilder from "./game.js";

// TODO:

// **리팩토링
// obj.freeze하기
// 빌더패턴사용하기(done)

// **디버깅
// bgm(done)

// 디비에 저장
// 탑1에게 메시지(메일)보내기
// 탑10보여주기
// 설명 팝업 다시 보지 않기 추가
// 변수명 규칙 통일(스네이크로)

const game_guide = "벌레를 피해 당근을 모두 수확해주세요!";

const main = document.querySelector("main");

const game_finish_banner = new Popup();
const field = new Field();
const sound_effect = new Sound();
// const game = new Game();
const game = new GameBuilder()
  .withGameDuration(15)
  .withGameSpeed(0.5)
  .withObjCount(5)
  .build();

const audioContext = new AudioContext();
let play_state = sound_effect.play_state;

game_finish_banner.set_click_listener(() => game.game_start());
game.set_click_listener(() => game.check_play_status());

window.onload = () => {
  game.set_time(game.count);
  field.obj_create(game.bug_count);

  game_finish_banner.show_game_guidline(game_guide);
};
