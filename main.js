// TODO:
// 객체 안 겹치게 배치하기

// 게임 룰 설명하기, 당근만 클릭하세요!(다시 보지 않기 추가)
// 움직이게 하기
// 구글로그인
// 디비에 저장
// 탑10보여주기
// 탑1에게 메시지보내기

// 카운트다운 할 시간을 담은 변수(1분)
// 테스트를 위해 시간 줄여놓음
let count = 15;
const original_count = count;

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

    document.querySelector(".modal > span").innerText = "YOU WON!";
    document.querySelector(".modal").classList.remove("hidden");

    background_audio.pause();
    background_audio.currentTime = 0;
    // play_state = false;

    // 당근 개수가 남아있으면 게임 실패
  } else if (count <= 0 && carrot_count !== 0) {
    url = "./sound/alert.wav";

    document.querySelector(".modal > span").innerText = "GAME OVER";
    document.querySelector(".modal").classList.remove("hidden");

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

    document.querySelector(".modal > span").innerText = "GAME OVER";
    document.querySelector(".modal").classList.remove("hidden");

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
  console.group("random_placing");
  const main = document.querySelector("main");

  const docWidth = window.innerWidth,
    docHeight = window.innerHeight;
  // console.log("docHeight: ", docHeight);
  // console.log("docWidth: ", docWidth);

  id = 0;
  const position_top = [];
  const position_left = [];
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
  console.log(position_top);
  console.log(position_left);

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
  }

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
const replay_btn = document.querySelector(".restart_btn");
replay_btn.addEventListener("click", (event) => {
  // console.log("restart clicked");
  // count 초기화
  count = original_count;
  carrot_count = original_count;
  bug_count = original_count;

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

  // bugs.map((obj) => {});
  // carrots.map((obj) => {});
  // 벌레 객체를 다시 만든다.
  obj_create();

  document.querySelector(".timer >span").innerText = "0:" + count;

  // // play버튼을 플레이 버튼으로 변경한다.
  // document.querySelector(".play").innerHTML =
  //   ' <i class="fas fa-play"></i>play';

  // 모달창을 숨긴다.
  document.querySelector(".modal").classList.add("hidden");
  // 카운터를 다시 가동한다.
  counter_working = true;
  counter = setInterval(timer, 1000);
});

//   console.groupEnd();
// };

// const click_event_obj = () => {
//   console.group("click_event_obj");
//   const bug = document.querySelector(".bug");

//   // 2. 당근/벌레 클릭 이벤트
//   bug.addEventListener("click", (event) => {
//     console.log(`event :`, event.target);

//     // 벌레 클릭
//     // if (event.target.className == "bug") {
//     alert("bug");
//     // } else if (event.target.className == "carrot") {
//     //   alert("carrot");
//     // }
//   });
//   console.groupEnd();
// };

window.onload = () => {
  // $('#audio').html('<audio autoplay><source src="audio/ding.mp3"></audio>');
  // document
  //   .querySelector("#audio")
  //   .innerHTML('<audio><source src="./sound/bg.mp3"></audio>');
  // document.querySelector("audio").setAttribute("crossorigin", "anonymous");

  document.querySelector(".timer >span").innerText = "0:" + count;
  obj_create();
  //   click_event_obj();
};
