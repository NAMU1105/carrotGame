"use strict";

import Game from "./game.js";

export default class Field {
  constructor() {
    // this.count_working = false;
    // this.is_paused = false;
    this.game = new Game();

    // this.level_counts = [11];
    // this.obj_counts = [10, 15];
    this.degrees = [];
    this.main = document.querySelector("main");
    this.position_top = [];
    this.position_left = [];

    this.docWidth = window.innerWidth;
    this.docHeight = window.innerHeight;
    this.main = document.querySelector("main");

    this.xPos = 0;
    this.yPos = 0;
    this.hit_wall_count = 1;
    this.no_move = false;
  }

  // 랜덤 숫자 생성 함수
  randomNum = (lower, upper) => {
    let myRandom = Math.floor(Math.random() * (upper - lower + 1)) + lower;
    return myRandom;
  };

  // 객체 생성 및 랜덤 위치 배치 함수
  obj_create = () => {
    console.group("obj_create");

    let id = 0;

    while (
      this.position_top.length <
      this.game.obj_counts[this.game.level] * 2
    ) {
      // while (this.position_top.length < bug_count * 2) {
      let random_top = this.randomNum(this.docHeight / 2, this.docHeight - 100);
      random_top = Math.round(random_top / 20) * 20;
      let random_left = this.randomNum(0, this.docWidth - 200);
      random_left = Math.round(random_left / 20) * 20;
      // const random_left = randomNum(0, docWidth - 900);
      if (this.position_top.indexOf(random_top) === -1)
        this.position_top.push(random_top);
      if (this.position_left.indexOf(random_left) === -1)
        this.position_left.push(random_left);
    }

    for (let i = 0; i < this.game.obj_counts[this.game.level]; i++) {
      this.bug_create(id, i);
      this.carrot_create(id, i);

      id++;

      let random_deg = this.randomNum(-360, 360);
      random_deg = Math.round(random_deg / 10) * 10;
      if (this.degrees.indexOf(random_deg) === -1)
        this.degrees.push(random_deg);
    }

    console.groupEnd();
  };

  bug_create = (id, index) => {
    const bug = document.createElement("div");
    bug.setAttribute("class", "bug_wrapper");

    const bug_img = document.createElement("img");
    bug_img.setAttribute("src", "img/bug.png");
    bug_img.setAttribute("alt", "bug");
    bug_img.setAttribute("class", "bug");
    bug_img.setAttribute("id", "bug_" + id);

    const random_top = this.position_top[index];
    const random_left = this.position_left[index];

    bug_img.style.top = random_top + "px";
    bug_img.style.left = random_left + "px";

    bug.appendChild(bug_img);

    this.main.appendChild(bug);
  };

  carrot_create = (id, index) => {
    const carrot = document.createElement("div");
    carrot.setAttribute("class", "carrot_wrapper");

    const carrot_img = document.createElement("img");
    carrot_img.setAttribute("src", "img/carrot.png");
    carrot_img.setAttribute("alt", "carrot");
    carrot_img.setAttribute("id", "carrot_" + id);
    carrot_img.setAttribute("class", "carrot");

    const random_top_carrot = this.position_top[
      this.game.obj_counts[this.game.level] * 2 - index - 1
    ];
    const random_left_carrot = this.position_left[
      this.game.obj_counts[this.game.level] * 2 - index - 1
    ];

    carrot_img.style.top = random_top_carrot + "px";
    carrot_img.style.left = random_left_carrot + "px";

    carrot.appendChild(carrot_img);

    this.main.appendChild(carrot);
  };

  // 남아있는 객체를 모두 없앤다.
  remove_objs = () => {
    const bugs = document.querySelectorAll(".bug_wrapper");
    const carrots = document.querySelectorAll(".carrot_wrapper");

    for (let i = 0; i < bugs.length; i++) {
      bugs[i].remove();
    }

    for (let i = 0; i < carrots.length; i++) {
      carrots[i].remove();
    }
  };

  //   벌레 나는 효과
  fly = () => {
    const bugs = document.querySelectorAll(".bug_wrapper>img");
    for (let i = 0; i < this.game.obj_counts[this.game.level]; i++) {
      this.degrees[i] += 1;
      // degrees[i]++;
      // 벽에 닿으면 돌아옴
      // TODO: 위 아래도 예외처리 추가하기
      let standard = this.xPos + this.position_left[i];
      // let verticalStandard = yPos + position_top[i];
      // console.log("docWidth: ", docWidth);

      // if (standard === docWidth) {
      if (standard >= 1206) {
        // console.log("standard: ", standard);
        this.hit_wall_count++;
      } else if (standard <= 0) {
        this.hit_wall_count++;
      }

      // hit_wall_count가 홀수일 경우 -> xPos++
      if (this.hit_wall_count % 2 === 1) {
        this.xPos += (this.game.level + 1) * this.game.speed;
        // yPos += (level + 1) * speed;

        // hit_wall_count가 짝수일 경우 -> xPos--
      } else {
        this.xPos -= (this.game.level + 1) * this.game.speed;
        // yPos -= (level + 1) * speed;
      }

      // TODO: 화면 사이즈 넘어가지 않게 처리
      // if (standard >= docWidth) {
      if (standard + 100 >= 1206) {
        this.no_move = true;
      } else {
        this.no_move = false;
      }

      if (!this.no_move) {
        document.querySelector(
          `#bug_${i}`
        ).style.transform = `translate(${this.xPos}px, ${this.yPos}px) rotate(${this.degrees[i]}deg)`;
      }
    }

    requestAnimationFrame(this.fly);
  };
}
