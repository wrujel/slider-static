import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const TIME_AUTO = 5000;
const TIME_RUNNING = 1500;
const SLIDE_COUNT = 3;

function buildDom(count = SLIDE_COUNT) {
  const items = (prefix) =>
    Array.from(
      { length: count },
      (_, i) => `<div class="item" data-id="${prefix}${i + 1}"></div>`,
    ).join("");

  document.body.innerHTML = `
    <div class="carousel">
      <div class="list">${items("slide")}</div>
      <div class="thumbnail">${items("thumb")}</div>
      <div class="arrows">
        <button id="prev">&lt;</button>
        <button id="next">&gt;</button>
      </div>
      <div class="time"></div>
    </div>
  `;
}

const orderOf = (selector) =>
  Array.from(document.querySelectorAll(`${selector} .item`)).map(
    (item) => item.dataset.id,
  );

const slides = () => orderOf(".carousel .list");
const thumbnails = () => orderOf(".carousel .thumbnail");
const carousel = () => document.querySelector(".carousel");

const clickNext = () => document.getElementById("next").click();
const clickPrev = () => document.getElementById("prev").click();

/** Re-executes app.js against the current DOM with a clean module registry. */
async function loadApp() {
  vi.resetModules();
  await import("../app.js");
}

describe("carousel", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    buildDom();
  });

  afterEach(() => {
    vi.useRealTimers();
    document.body.innerHTML = "";
  });

  it("leaves the slides untouched until a timer or click fires", async () => {
    await loadApp();

    expect(slides()).toEqual(["slide1", "slide2", "slide3"]);
    expect(thumbnails()).toEqual(["thumb1", "thumb2", "thumb3"]);
    expect(carousel().className).toBe("carousel");
  });

  it("auto-advances one slide after the auto-play delay", async () => {
    await loadApp();

    vi.advanceTimersByTime(TIME_AUTO - 1);
    expect(slides()).toEqual(["slide1", "slide2", "slide3"]);

    vi.advanceTimersByTime(1);
    expect(slides()).toEqual(["slide2", "slide3", "slide1"]);
    expect(thumbnails()).toEqual(["thumb2", "thumb3", "thumb1"]);
    expect(carousel().classList.contains("next")).toBe(true);
  });

  it("keeps auto-advancing on every interval", async () => {
    await loadApp();

    vi.advanceTimersByTime(TIME_AUTO);
    expect(slides()).toEqual(["slide2", "slide3", "slide1"]);

    vi.advanceTimersByTime(TIME_AUTO);
    expect(slides()).toEqual(["slide3", "slide1", "slide2"]);

    vi.advanceTimersByTime(TIME_AUTO);
    expect(slides()).toEqual(["slide1", "slide2", "slide3"]);
    expect(thumbnails()).toEqual(["thumb1", "thumb2", "thumb3"]);
  });

  it("moves the first slide to the end when next is clicked", async () => {
    await loadApp();

    clickNext();

    expect(slides()).toEqual(["slide2", "slide3", "slide1"]);
    expect(thumbnails()).toEqual(["thumb2", "thumb3", "thumb1"]);
    expect(carousel().classList.contains("next")).toBe(true);
    expect(carousel().classList.contains("prev")).toBe(false);
  });

  it("moves the last slide to the front when prev is clicked", async () => {
    await loadApp();

    clickPrev();

    expect(slides()).toEqual(["slide3", "slide1", "slide2"]);
    expect(thumbnails()).toEqual(["thumb3", "thumb1", "thumb2"]);
    expect(carousel().classList.contains("prev")).toBe(true);
    expect(carousel().classList.contains("next")).toBe(false);
  });

  it("removes the animation class once the transition finishes", async () => {
    await loadApp();

    clickNext();
    vi.advanceTimersByTime(TIME_RUNNING - 1);
    expect(carousel().classList.contains("next")).toBe(true);

    vi.advanceTimersByTime(1);
    expect(carousel().classList.contains("next")).toBe(false);
  });

  it("restarts the transition timer when a second click interrupts it", async () => {
    await loadApp();

    clickNext();
    vi.advanceTimersByTime(1000);
    clickPrev();

    // 2000ms after the first click, but only 1000ms after the second one.
    vi.advanceTimersByTime(1000);
    expect(carousel().classList.contains("next")).toBe(true);
    expect(carousel().classList.contains("prev")).toBe(true);

    vi.advanceTimersByTime(TIME_RUNNING - 1000);
    expect(carousel().classList.contains("next")).toBe(false);
    expect(carousel().classList.contains("prev")).toBe(false);
  });

  it("restarts the auto-play timer after manual navigation", async () => {
    await loadApp();

    vi.advanceTimersByTime(TIME_AUTO - 1000);
    clickNext();
    expect(slides()).toEqual(["slide2", "slide3", "slide1"]);

    // The original auto-play deadline is gone; only the click's own one counts.
    vi.advanceTimersByTime(TIME_AUTO - 1);
    expect(slides()).toEqual(["slide2", "slide3", "slide1"]);

    vi.advanceTimersByTime(1);
    expect(slides()).toEqual(["slide3", "slide1", "slide2"]);
  });
});
