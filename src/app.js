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
// game_finish_banner.set_click_listener("what");

// TODO: 이곳의 클릭 리스너를 없앨 것
// main.addEventListener("click", (event) => {
//   // 1. 플레이/일시정지 버튼 클릭 이벤트
//   if (event.target.classList.contains("play")) {
//     // console.log("play button clicked");

//     //게임 시작
//     if (!game.counter_working && !game.is_paused) {
//       !game_finish_banner.popup.classList.contains("hide") &&
//         game_finish_banner.hide();
//       game.game_start();
//       // field.fly();

//       // 일시정지 해제
//     } else if (!game.counter_working && game.is_paused) {
//       // console.log("일시정지 해제");

//       // game.set_play_btn_pause();
//       // game.game_start();
//       game.game_resume();

//       // 일시정지
//     } else if (game.counter_working && !game.is_paused) {
//       game.game_pause();
//     }

//     // // 오디오가 중지상태라면
//     if (audioContext.state === "suspended") {
//       // 실행 상태로 변경
//       audioContext.resume();
//     }
//     play_state = !play_state;
//     if (play_state) {
//       // background_audio.play();
//       const background_audio_play = sound_effect.play_bg_sound();
//       // const background_audio_play = sound_effect.background_audio.play();
//       sound_effect.check_bg_running(background_audio_play);
//     } else {
//       sound_effect.pause_bg_sound();
//       // sound_effect.background_audio.pause();
//       // console.log("here");
//     }

//     // 2. replay 버튼 클릭 이벤트
//   } else if (event.target.classList.contains("modal_restart_btn")) {
//     // console.log("replay button clicked");

//     // 배너에 나온 리플레이 버튼이면 리플레이가 아니라 게임 스타드 함수 실행
//     if (game_finish_banner.popupe_play_btn.innerText === "닫기") {
//       // if (game_finish_banner.popupe_play_btn.innerText === "Play") {
//       // game_start();
//       return;
//     }

//     game.clear_timer_warning();

//     // // 기존 정보 리셋
//     // field.position_top = [];
//     // field.position_left = [];

//     // 남아있는 벌레, 당근 객체를 모두 없앤다.
//     // field.remove_objs();
//     game.reset_game_setting();
//     // 벌레, 당근 객체를 다시 만든다.
//     // field.obj_create();

//     // 모달창을 숨긴다.
//     game_finish_banner.hide();
//     // 게임 다시 시작
//     game.game_start();

//     // 배경음악 플레이
//     sound_effect.play_bg_sound();

//     // 3. obj 클릭 이벤트
//   } else if (
//     event.target.classList.contains("bug") ||
//     event.target.classList.contains("carrot")
//   ) {
//     const obj_id = event.target.id;
//     game.counting(obj_id);
//   }
// });

window.onload = () => {
  game.set_time(game.count);
  // game.set_time(game.time_counts[game.level]);
  field.obj_create(game.bug_count);

  game_finish_banner.show_game_guidline(game_guide);
};
