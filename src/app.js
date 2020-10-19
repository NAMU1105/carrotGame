"use strict";

import Popup from "./popup.js";
import Field from "./field.js";

// TODO:
// 이벤트 위임으로 변경하기
// addEventListener를 많이 쓰면 성능이 안 좋아진다.
// -> 그래서 이벤트 위임을 사용함
// 리팩토링
// 변수명 규칙 통일(스네이크로)

// 게임 룰 설명하기, 당근만 클릭하세요!(다시 보지 않기 추가)
// TODO: 움직이게 하기 ->raf
// 구글로그인
// 디비에 저장
// 탑10보여주기
// 탑1에게 메시지보내기

// const express = require("express");
// const app = express();
// const port = 3003;

// app.use(express.static("public"));

// app.get("/", (req, res) => {
//   console.log("?");
//   res.send("Hello World!");
// });

// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`);
// });

// 카운트다운 할 시간을 담은 변수(1분)
// 테스트를 위해 시간 줄여놓음
let count = 10;
const original_count = 10;

// 당근 수
// 0이 되어야 게임 성공
let carrot_count = 10;

// 벌레 수
// 수가 줄어들면 게임 실패
let bug_count = 10;
// 카운터 객체
let counter;
// 카운터 작동 여부
let counter_working = false;

// 일시정지 여부
let is_paused = false;

const docWidth = window.innerWidth,
  docHeight = window.innerHeight;
console.log("docHeight: ", docHeight);
// console.log("docWidth: ", docWidth);
// console.log("windowScreenWidth: ", window.screen.width);
// console.log("windowOuterWidth: ", window.outerWidth);
// console.log("windowScreenAvailWidth: ", window.screen.availWidth);
// console.log("documentClientWidth: ", document.documentElement.clientWidth);
// console.log("document.body.offsetWidth: ", document.body.offsetWidth);
// console.log("document.body.clientWidth: ", document.body.clientWidth);

let position_top = [];
let position_left = [];

const levelSpeed = [1, 5, 10, 15];
let level = 0;
const speed = 0.5;

const levelCounts = [10];
const levelObjCounts = [10, 15];

const degrees = [];

// *************************************** //
// 리팩토링
// *************************************** //

const game_finish_banner = new Popup();
const field = new Field();

// *************************************** //
// 랜덤 숫자 생성 함수
// *************************************** //
const randomNum = (lower, upper) => {
  //   for (let i = 0; i < 10; i++) {
  let myRandom = Math.floor(Math.random() * (upper - lower + 1)) + lower;
  //   console.log(myRandom);
  return myRandom;
  //   }
};

// *************************************** //
// 게임이 실패인지 종료인지 확인하는 함수
// *************************************** //
const check_game_end = () => {
  console.group("check_game_end");
  let url = "";
  const background_audio = document.querySelector("audio");

  if (carrot_count === 0) {
    // alert("게임성공!");
    // replay 모달창을 보여준다.
    clearInterval(counter);
    counter_working = false;

    url = "./sound/game_win.mp3";

    game_finish_banner.show_with_text("YOU WON!");

    background_audio.pause();
    background_audio.currentTime = 0;
    // play_state = false;

    // 당근 개수가 남아있으면 게임 실패
  } else if (count <= 0 && carrot_count !== 0) {
    url = "./sound/alert.wav";

    game_finish_banner.show_with_text("GAME OVER");

    clearInterval(counter);
    counter_working = false;
    background_audio.pause();
    background_audio.currentTime = 0;
    // play_state = false;
  } else if (bug_count !== 10) {
    url = "./sound/alert.wav";

    // alert("game over");
    // replay 모달창을 보여준다.
    clearInterval(counter);
    counter_working = false;

    // document.querySelector(".modal > span").innerText = "GAME OVER";
    // document.querySelector(".modal").classList.remove("hidden");
    game_finish_banner.show_with_text("GAME OVER");

    background_audio.pause();
    background_audio.currentTime = 0;
    // play_state = false;
  }

  const sound_effect_play = new Audio(url).play();
  if (sound_effect_play !== undefined) {
    sound_effect_play
      .then(function () {
        // Automatic playback started!
      })
      .catch(function (error) {
        // Automatic playback failed.
        // Show a UI element to let the user manually start playback.
      });
  }
  // const sound_effect = new Audio(url);
  // sound_effect.play();

  console.groupEnd();
};

// *************************************** //
// 이벤트 객체 클릭 시 발생하는 함수
// *************************************** //
const counting = (target) => {
  // const counting = (target, carrot_id) => {

  let url = "";

  console.group("counting");
  const carrot_number = document.querySelector(".count > span");

  if (counter_working === false) return;

  if (target.getAttribute("class") === "carrot") {
    // console.log("당근클릭");
    // 음향효과
    url = "./sound/carrot_pull.mp3";
    const remove_item = document.querySelector("#" + target.getAttribute("id"));
    remove_item.remove();

    carrot_count--;
    carrot_number.innerText = carrot_count;
  } else if (target.getAttribute("class") === "bug") {
    // 음향효과
    url = "./sound/bug_pull.mp3";
    bug_count--;
    // alert("game over");
    // clearInterval(counter);
    // counter_working = false;
    console.log("bug_count: ", bug_count);
  }

  // const sound_effect = new Audio(url);
  const sound_effect_play = new Audio(url).play();

  if (sound_effect_play !== undefined) {
    sound_effect_play
      .then(function () {
        // Automatic playback started!
      })
      .catch(function (error) {
        // Automatic playback failed.
        // Show a UI element to let the user manually start playback.
      });
  }

  check_game_end();

  console.groupEnd();
};

// *************************************** //
// 객체 랜덤 위치 배치 함수
// *************************************** //
const obj_create = () => {
  console.group("obj_create");
  const main = document.querySelector("main");

  let id = 0;
  // position_top = [];
  // position_left = [];
  while (position_top.length < bug_count * 2) {
    // var r = Math.floor(Math.random() * 100) + 1;
    // const random_top = randomNum(700, 800);
    let random_top = randomNum(docHeight / 2, docHeight - 100);
    random_top = Math.round(random_top / 20) * 20;
    let random_left = randomNum(0, docWidth - 200);
    random_left = Math.round(random_left / 20) * 20;
    // const random_left = randomNum(0, docWidth - 900);
    if (position_top.indexOf(random_top) === -1) position_top.push(random_top);
    if (position_left.indexOf(random_left) === -1)
      position_left.push(random_left);
  }
  // console.log(position_top);
  // console.log(position_left);

  for (let i = 0; i < bug_count; i++) {
    //   벌레 생성
    const bug = document.createElement("div");
    bug.setAttribute("class", "bug_wrapper");

    const bug_img = document.createElement("img");
    bug_img.setAttribute("src", "img/bug.png");
    bug_img.setAttribute("alt", "bug");
    bug_img.setAttribute("class", "bug");
    bug_img.setAttribute("id", "bug_" + id);

    const random_top = position_top[i];
    const random_left = position_left[i];

    bug_img.style.top = random_top + "px";
    bug_img.style.left = random_left + "px";

    // bug_img.style.transform = `translate(${random_top}px ${random_left}px )`;

    bug.appendChild(bug_img);

    bug.addEventListener(
      "click",
      () => {
        counting(bug_img);
      },
      false
    );

    main.appendChild(bug);

    // 당근 생성
    const carrot = document.createElement("div");
    carrot.setAttribute("class", "carrot_wrapper");

    const carrot_img = document.createElement("img");
    carrot_img.setAttribute("src", "img/carrot.png");
    carrot_img.setAttribute("alt", "carrot");
    carrot_img.setAttribute("id", "carrot_" + id);
    carrot_img.setAttribute("class", "carrot");

    const random_top_carrot = position_top[bug_count * 2 - i - 1];
    const random_left_carrot = position_left[bug_count * 2 - i - 1];

    carrot_img.style.top = random_top_carrot + "px";
    carrot_img.style.left = random_left_carrot + "px";

    carrot.appendChild(carrot_img);
    carrot.addEventListener(
      "click",
      () => {
        counting(carrot_img);
        // counting("carrot", "carrot_" + id);
      },
      false
    );

    main.appendChild(carrot);

    id++;
    // 여기서 랜덤 degree구하기
    // for (let j = 0; j < bug_count; j++) {
    let random_deg = randomNum(-360, 360);
    random_deg = Math.round(random_deg / 10) * 10;
    if (degrees.indexOf(random_deg) === -1) degrees.push(random_deg);
    // }
  }
  console.log(degrees);

  console.groupEnd();
};

// *************************************** //
// timer 함수
// *************************************** //
const timer = () => {
  if (!is_paused) count--;

  let left_time = Math.floor(count / 60) + ":" + (count % 60);
  const timer_text = document.querySelector(".timer > span");

  // 타이머 종료
  if (count <= 0) {
    clearInterval(counter);

    // 게임 결과 체크
    if (counter_working) check_game_end();

    counter_working = false;
    timer_text.innerText = "0:0";
    // 끝났다는 문구 & 결과 &리플레이버튼 띄우기
  } else if (count < 10) {
    // 시간이 얼마 남지 않았으므로 빨간색 백그라운드 효과를 준다.
    document.querySelector(".timer").classList.add("warning");
    timer_text.innerText = left_time;
  } else {
    // 남은 시간 계산
    // console.log("left_time: ", left_time);

    const timer_text = document.querySelector(".timer > span");
    timer_text.innerText = left_time;
  }
};

// *************************************** //
// 온클릭 이벤트들
// *************************************** //
// 1. 타이머 클릭 이벤트
// const click_timer = () => {
//   console.group("");

const start_btn = document.querySelector(".play");
const background_audio = document.querySelector("audio");

// AudioContext
const audioContext = new AudioContext();
// AudioDestinationNode
const audioDestination = audioContext.destination;
// MediaElementAudioSourceNode
const audioSourceNode = audioContext.createMediaElementSource(background_audio);
// GainNode
const gainNode = audioContext.createGain();
audioSourceNode.connect(gainNode).connect(audioDestination);
let play_state = false;

start_btn.addEventListener("click", (event) => {
  // 일시정지
  if (counter_working && !is_paused) {
    is_paused = true;
    // play로 버튼 모양 다시 바꾼다.
    document.querySelector(".play").innerHTML =
      '<i class="fas fa-play"></i> play';

    // 배경음악 정지
    // background_audio.pause();
    // background_audio.currentTime = 0;

    //게임 시작
  } else if (!counter_working) {
    // play버튼을 스탑버튼으로 변경한다.
    document.querySelector(".play").innerHTML =
      '<i class="fas fa-pause"></i> pause';
    // 배경음악 플레이
    const background_audio_play = background_audio.play();
    if (background_audio_play !== undefined) {
      background_audio_play
        .then(function () {
          // Automatic playback started!
        })
        .catch(function (error) {
          // Automatic playback failed.
          // Show a UI element to let the user manually start playback.
        });
    }
    counter_working = true;
    counter = setInterval(timer, 1000);

    // 일시정지 해제
  } else if (is_paused) {
    // background_audio.play();
    // play버튼을 스탑버튼으로 변경한다.
    document.querySelector(".play").innerHTML =
      '<i class="fas fa-pause"></i> pause';
    is_paused = false;
  }

  // 오디오가 중지상태라면
  if (audioContext.state === "suspended") {
    // 실행 상태로 변경
    audioContext.resume();
  }
  play_state = !play_state;
  if (play_state) {
    // background_audio.play();
    const background_audio_play = background_audio.play();

    if (background_audio_play !== undefined) {
      background_audio_play
        .then(function () {
          // Automatic playback started!
        })
        .catch(function (error) {
          // Automatic playback failed.
          // Show a UI element to let the user manually start playback.
        });
    }
  } else {
    background_audio.pause();
    // console.log("here");
  }
});

// 2. replay 버튼 클릭 이벤트
const replay_btn = document.querySelector(".modal_restart_btn");
replay_btn.addEventListener("click", (event) => {
  // console.log("restart clicked");
  // count 초기화
  count = levelCounts[level];
  carrot_count = levelObjCounts[level];
  bug_count = levelObjCounts[level];
  // count = original_count;
  // carrot_count = original_count;
  // bug_count = original_count;

  position_top = [];
  position_left = [];

  const carrot_number = document.querySelector(".count > span");
  carrot_number.innerText = carrot_count;

  // 배경음악 플레이
  background_audio.play();

  // 남아있는 벌레 객체를 모두 없앤다.
  const bugs = document.querySelectorAll(".bug_wrapper");
  const carrots = document.querySelectorAll(".carrot_wrapper");

  for (let i = 0; i < bugs.length; i++) {
    bugs[i].remove();
  }

  for (let i = 0; i < carrots.length; i++) {
    carrots[i].remove();
  }

  // // bugs.map((obj) => {});
  // // carrots.map((obj) => {});
  // // 벌레, 당근 객체를 다시 만든다.
  obj_create();

  document.querySelector(".timer >span").innerText = "0:" + count;

  // play버튼을 플레이 버튼으로 변경한다.
  // document.querySelector(".play").innerHTML =
  //   ' <i class="fas fa-play"></i>play';

  // // 모달창을 숨긴다.
  game_finish_banner.hide();
  // // 카운터를 다시 가동한다.
  counter_working = true;
  counter = setInterval(timer, 1000);
});

// *************************************** //
// raf, 벌레 날아다니는 효과
// *************************************** //
let xPos = 0;
let yPos = 0;
// let deg = 40;
// let deg2 = -10;
let hitWallCount = 1;
let hitTopBottomCount = 1;

let noMove = false;
// let hitWallPos = 0;
// let hitWall = false;

// for (let j = 0; j < bug_count; j++) {
//   let random_deg = randomNum(-360, 360);
//   random_deg = Math.round(random_deg / 10) * 10;
//   if (degrees.indexOf(random_deg) === -1) degrees.push(random_deg);
// }
// console.log(degrees);

// TODO: 클래스화 해서 찍어내는게 더 빠를듯
const fly = () => {
  const bugs = document.querySelectorAll(".bug_wrapper>img");
  for (let i = 0; i < levelObjCounts[level]; i++) {
    degrees[i] += 1;
    // degrees[i]++;
    // 벽에 닿으면 돌아옴
    // TODO: 위 아래도 예외처리 추가하기
    let standard = xPos + position_left[i];
    let verticalStandard = yPos + position_top[i];
    // console.log("docWidth: ", docWidth);

    // if (standard === docWidth) {
    if (standard >= docWidth) {
      // console.log("standard: ", standard);
      hitWallCount++;
    } else if (standard <= 0) {
      hitWallCount++;
    }

    // console.log("hitTopBottomCount: ", hitTopBottomCount);

    // hitWallCount가 홀수일 경우 -> xPos++
    if (hitWallCount % 2 === 1) {
      xPos += (level + 1) * speed;
      // yPos += (level + 1) * speed;

      // hitWallCount가 짝수일 경우 -> xPos--
    } else {
      xPos -= (level + 1) * speed;
      // yPos -= (level + 1) * speed;
    }

    // if (verticalStandard >= docHeight) {
    //   yPos -= (level + 1) * speed;
    // } else if (verticalStandard <= 0) {
    //   yPos -= (level + 1) * speed;
    // } else {
    //   yPos += (level + 1) * speed;
    // }

    // if (hitTopBottomCount    % 2 === 1) {
    //   yPos += (level + 1) * speed;

    // } else {
    //   yPos -= (level + 1) * speed;
    // }

    // for (let i = 0; i < levelObjCounts[level]; i++) {
    //   degrees[i] += 3;
    // console.log(i);
    // console.log(original_count);
    // if (i % 2 === 1) {
    //   document.querySelector(
    //     `#bug_${i}`
    //   ).style.transform = `translate(${xPos}px, ${yPos}px) rotate(${degrees[i]}deg)`;
    // } else {
    //   document.querySelector(
    //     `#bug_${i}`
    //   ).style.transform = `translate(${-xPos}px, ${yPos}px) rotate(${
    //     degrees[i]
    //   }deg)`;
    // }

    // TODO: 화면 사이즈 넘어가지 않게 처리
    // if (standard >= docWidth) {
    if (standard + 100 >= docWidth) {
      // xPos = xPos - (standard - docWidth);
      // xPos = xPos - (level + 1) * speed;
      // xPos = docWidth - (level + 1) * speed - xPos;
      // xPos = docWidth - (level + 1) * speed - xPos - 1;
      // console.log("docWidth - standard: ", standard - docWidth);
      // console.log("standard: ", standard);
      // console.log("xPos: ", xPos);
      noMove = true;
    } else {
      noMove = false;
    }

    if (!noMove) {
      document.querySelector(
        `#bug_${i}`
      ).style.transform = `translate(${xPos}px, ${yPos}px) rotate(${degrees[i]}deg)`;
    }
    // bugs[
    //   i
    // ].style.transform = `translate(${xPos}px, ${xPos}px) rotate(${degrees[i]}deg)`;

    // if (standard >= docWidth) {
    //   // bugs[i].style.transform = `translateX(${-(standard - docWidth)}px) `;
    //   bugs[0].style.transform = `translateX(${-10000}px) `;
    // }
  }

  // bugs[0].style.transform = `translateX(${xPos}px) `;
  // standard = xPos + position_left[0];
  // if (standard >= docWidth) {
  //   console.log("here");
  //   // console.log("xPos: ", xPos);
  //   console.log("standard: ", standard);
  //   console.log("docWidth - standard: ", standard - docWidth);

  //   bugs[0].style.transform = `translateX(${-(standard - docWidth)}px) `;
  //   // bugs[0].style.transform = `translateX(${xPos - (standard - docWidth)}px) `;
  //   // bugs[0].style.transform = `translateX(${1000}px) `;
  //   // bugs[0].style.left = `${docWidth}px `;
  //   // return;
  // }
  // bugs[0].style.transform = `translate(${xPos}px, ${xPos}px) `;
  // bugs[1].style.transform = `translate(${-xPos}px, ${-xPos}px) rotate(${deg2}deg)`;
  // bugs[0].style.transform = `translateX(${xPos}px) rotate(${deg}deg)`;

  requestAnimationFrame(fly);
  // console.log(xPos);
  // console.log(`hitWallCount` + hitWallCount);
  // console.log(`position_left[0]` + position_left[0]);
  // console.log(`둘다 더한 것` + (xPos + position_left[0]));
};

window.onload = () => {
  // $('#audio').html('<audio autoplay><source src="audio/ding.mp3"></audio>');
  // document
  //   .querySelector("#audio")
  //   .innerHTML('<audio><source src="./sound/bg.mp3"></audio>');
  // document.querySelector("audio").setAttribute("crossorigin", "anonymous");

  document.querySelector(".timer >span").innerText = "0:" + count;
  obj_create();

  // fly();
  //   click_event_obj();
};
