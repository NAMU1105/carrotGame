"use strict";

// import { Popup } from "./popup.js";
// import Field from "./field.js";
// import Game from "./game.js";
import GameBuilder from "./game.js";

// TODO:

// ** 기능 추가
// 게임 결과 디비에 저장
// 탑1에게 메시지(메일)보내기
// 탑10보여주기
// 설명 팝업 다시 보지 않기 추가

// const game_guide = "벌레를 피해 당근을 모두 수확해주세요!";
// const game_finish_banner = new Popup();
// const field = new Field();
// const game = new Game();
const game = new GameBuilder()
  .with_game_duration(15)
  .with_game_speed(0.5)
  .with_obj_count(5)
  .build();

// game_finish_banner.set_click_listener(() => game.game_start());
game.set_click_listener(() => game.check_play_status());

window.onload = () => {
  // game.set_time(game.count);
  // field.obj_create(game.bug_count);
  // game_finish_banner.show_game_guidline(game_guide);

  game.game_ready();
};
