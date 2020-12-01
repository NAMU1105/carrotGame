"use strict";

export const popup_text = Object.freeze({
  guide: "벌레를 피해 당근을 모두 수확해주세요!",
  win: "YOU WON!",
  game_over: "GAME OVER",
});

export class Popup {
  constructor() {
    this.popup = document.querySelector(".modal");
    this.popup_text = document.querySelector(".modal > span");
    this.popupe_play_btn = document.querySelector(".modal_restart_btn");

    // this.popup.addEventListener("click", () => {
    //   console.log(`popup`);
    // });
    this.popupe_play_btn.addEventListener("click", () => {
      if (this.popupe_play_btn.innerText === "닫기") {
        this.hide();
        return;
      }

      this.on_click && this.on_click();
      this.hide();
    });
  }

  set_click_listener = (on_click) => {
    this.on_click = on_click;
    // console.log(on_click);
  };

  hide = () => {
    this.popup.classList.add("hidden");
  };

  show_with_text = (text) => {
    this.popup_text.innerText = text;
    this.popup.classList.remove("hidden");

    // console.log(typeof text);

    if (text.includes("WON")) {
      this.popupe_play_btn.innerText = "Level up";
    } else {
      this.popupe_play_btn.innerText = "Retry";
    }
  };

  show_game_guidline = (text) => {
    this.popup_text.innerText = text;
    this.popup.classList.remove("hidden");
    this.popupe_play_btn.innerText = "닫기";
    this.popupe_play_btn.setAttribute("onClick", "this.hide");
  };
}
