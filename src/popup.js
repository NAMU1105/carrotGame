"use strict";

export default class Popup {
  constructor() {
    this.popup = document.querySelector(".modal");
    this.popup_text = document.querySelector(".modal > span");
    this.popupe_play_btn = document.querySelector(".modal_restart_btn");

    this.popupe_play_btn.addEventListener("click", () => {
      this.on_click && this.on_click();
      this.hide();
    });
  }

  set_click_listener = (on_click) => {
    this.on_click = on_click;
  };

  hide = () => {
    this.popup.classList.add("hidden");
  };

  show_with_text = (text) => {
    this.popup_text.innerText = text;
    this.popup.classList.remove("hidden");
    this.popupe_play_btn.innerText = "Replay";
  };

  show_game_guidline = (text) => {
    this.popup_text.innerText = text;
    this.popup.classList.remove("hidden");
    this.popupe_play_btn.innerText = "닫기";
    this.popupe_play_btn.setAttribute("onClick", "this.hide");
  };
}
