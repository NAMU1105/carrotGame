"use strict";

// import Game from "./game.js";

export default class Field {
  constructor() {
    // this.game = new Game();
    this.degrees = [];
    this.main = document.querySelector("main");
    // this.bug_wrapper = document.querySelector(".bug_wrapper");
    this.position_top = [];
    this.position_left = [];

    this.docWidth = window.innerWidth;
    this.docHeight = window.innerHeight;

    this.rafID = null;
    this.angle = 0;

    this.x_pos = [];
    // this.y_pos = [];
    this.hit_wall_counts = [];
    // this.hit_wall = false;
    // this.xPos = 0;
    this.yPos = 0;
    // this.hit_wall_count = 1;
    // this.no_move = false;
  }

  set_click_listener = (on_click) => {
    this.on_click = on_click;
  };

  // 랜덤 숫자 생성 함수
  randomNum = (lower, upper) => {
    let myRandom = Math.floor(Math.random() * (upper - lower + 1)) + lower;
    return myRandom;
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

  carrot_create = (id, index, obj_counts) => {
    const carrot = document.createElement("div");
    carrot.setAttribute("class", "carrot_wrapper");

    const carrot_img = document.createElement("img");
    carrot_img.setAttribute("src", "img/carrot.png");
    carrot_img.setAttribute("alt", "carrot");
    carrot_img.setAttribute("id", "carrot_" + id);
    carrot_img.setAttribute("class", "carrot");

    const random_top_carrot = this.position_top[
      obj_counts * 2 - index - 1
      //   this.game.bug_count * 2 - index - 1
      //   this.game.obj_counts[this.game.level] * 2 - index - 1
    ];
    const random_left_carrot = this.position_left[
      obj_counts - index - 1
      //   this.game.bug_count - index - 1
      //   this.game.bug_count - index - 1
    ];

    carrot_img.style.top = random_top_carrot + "px";
    carrot_img.style.left = random_left_carrot + "px";

    carrot.appendChild(carrot_img);

    this.main.appendChild(carrot);
  };

  // 객체 생성 및 랜덤 위치 배치 함수
  obj_create = (obj_counts) => {
    console.group("obj_create");

    // 기존 정보 리셋
    this.position_top = [];
    this.position_left = [];

    let id = 0;

    while (
      this.position_top.length <
      obj_counts * 2
      //   this.game.bug_count * 2
      //   this.game.obj_counts[this.game.level] * 2
    ) {
      // while (this.position_top.length < bug_count * 2) {
      let random_top = this.randomNum(this.docHeight / 2, this.docHeight - 200);
      random_top = Math.round(random_top / 30) * 30;
      let random_left = this.randomNum(0, this.docWidth - 200);
      random_left = Math.round(random_left / 30) * 30;
      // const random_left = randomNum(0, docWidth - 900);
      //   if (this.position_top.indexOf(random_top) === -1)
      this.position_top.push(random_top);
      //   if (this.position_left.indexOf(random_left) === -1)
      this.position_left.push(random_left);
    }

    // console.log(" this.position_left: ", this.position_left);

    for (let i = 0; i < obj_counts; i++) {
      // for (let i = 0; i < this.game.bug_count; i++) {
      // for (let i = 0; i < this.game.obj_counts[this.game.level]; i++) {
      this.bug_create(id, i);
      this.carrot_create(id, i, obj_counts);

      id++;

      let random_deg = this.randomNum(-360, 360);
      random_deg = Math.round(random_deg / 10) * 10;
      if (this.degrees.indexOf(random_deg) === -1)
        this.degrees.push(random_deg);
    }

    console.groupEnd();
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

  // 벌레 움직이는 애니메이션
  creat_bug_movement = (obj, index) => {
    // console.log("index: ", index);
    // console.log("this.hit_wall_counts: ", this.hit_wall_counts);
    // console.log("this.x_pos: ", this.x_pos);

    const standard = obj.getBoundingClientRect().left;

    // 값이 없는 경우 예외처리
    if (!this.hit_wall_counts[index]) {
      this.hit_wall_counts[index] = 1;
    } else if (!this.x_pos[index]) {
      this.x_pos[index] = 0;
    }
    // else if (!this.y_pos[index]) {
    //   this.y_pos[index] = 0;
    // }

    // 화면 밖을 나가는 경우 예외처리
    if (standard >= this.docWidth - 100 || standard <= 0) {
      // this.hit_wall_count++;
      this.hit_wall_counts[index] = Number(this.hit_wall_counts[index]) + 1;
      // this.hit_wall = true;
      // obj.style.transform += "scaleX(-1)";
    }
    // else {
    //   this.hit_wall = false;
    // }
    // console.log("this.hit_wall_counts[index]: ", this.hit_wall_counts[index]);

    this.yPos += 0.3 * Math.sin(this.angle);
    this.angle += 0.05;

    if (this.hit_wall_counts[index] % 2 === 1) {
      // console.log("증가");
      this.x_pos[index] += 3;
      obj.style.transform = `translate(${this.x_pos[index]}px, ${this.yPos}px)`;
      // obj.style.transform += `scaleX(-1)`;
    } else {
      // console.log("감소");
      this.x_pos[index] -= 3;
      obj.style.transform = `translate(${this.x_pos[index]}px, ${this.yPos}px) scaleX(-1)`;
    }
  };

  creat_bug_movement_raf = (level, speed) => {
    const bugs = document.querySelectorAll(".bug_wrapper>img");

    // console.log(" this.position_left: ", this.position_left);
    for (let i = 0; i < bugs.length; i++) {
      bugs[i] && this.creat_bug_movement(bugs[i], i);
    }
    this.rafID = requestAnimationFrame(this.creat_bug_movement_raf);
  };

  reset_setting = () => {
    this.x_pos = [];
    this.hit_wall_counts = [];
    this.yPos = 0;
    this.angle = 0;
  };

  cancel_bug_movement = () => {
    cancelAnimationFrame(this.rafID);
  };
}
