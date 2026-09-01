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

const thumbnailAt = (index) =>
  document.querySelectorAll(".carousel .thumbnail .item")[index];
const clickThumbnail = (index) => thumbnailAt(index).click();
const pressKeyOnThumbnail = (index, key) =>
  thumbnailAt(index).dispatchEvent(
    new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }),
  );

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

  it("hands the auto-play delay to the countdown bar in CSS", async () => {
    await loadApp();

    expect(carousel().style.getPropertyValue("--time-auto")).toBe(
      `${TIME_AUTO}ms`,
    );
  });

  it("exposes the thumbnails as buttons", async () => {
    await loadApp();

    for (const item of document.querySelectorAll(".carousel .thumbnail .item")) {
      expect(item.getAttribute("role")).toBe("button");
      expect(item.getAttribute("tabindex")).toBe("0");
    }
  });

  it("opens the clicked thumbnail, skipping the slides in between", async () => {
    await loadApp();

    clickThumbnail(2);

    expect(slides()).toEqual(["slide3", "slide1", "slide2"]);
    expect(thumbnails()).toEqual(["thumb3", "thumb1", "thumb2"]);
    expect(carousel().classList.contains("next")).toBe(true);
  });

  it("opens the clicked thumbnail from the keyboard", async () => {
    await loadApp();

    pressKeyOnThumbnail(1, "Enter");
    expect(slides()).toEqual(["slide2", "slide3", "slide1"]);

    vi.advanceTimersByTime(TIME_RUNNING);
    pressKeyOnThumbnail(1, " ");
    expect(slides()).toEqual(["slide3", "slide1", "slide2"]);
  });

  it("ignores keys that are not Enter or Space", async () => {
    await loadApp();

    pressKeyOnThumbnail(1, "a");

    expect(slides()).toEqual(["slide1", "slide2", "slide3"]);
    expect(carousel().className).toBe("carousel");
  });

  it("does nothing when the thumbnail of the current slide is clicked", async () => {
    await loadApp();

    clickThumbnail(0);

    expect(slides()).toEqual(["slide1", "slide2", "slide3"]);
    expect(thumbnails()).toEqual(["thumb1", "thumb2", "thumb3"]);
    expect(carousel().className).toBe("carousel");
  });

  it("ignores thumbnail clicks while a transition is still running", async () => {
    await loadApp();

    clickNext();
    clickThumbnail(2);

    expect(slides()).toEqual(["slide2", "slide3", "slide1"]);

    // Once the transition ends the picker answers again.
    vi.advanceTimersByTime(TIME_RUNNING);
    clickThumbnail(2);
    expect(slides()).toEqual(["slide1", "slide2", "slide3"]);
  });

  it("ignores thumbnail clicks while a prev transition is running", async () => {
    await loadApp();

    clickPrev();
    clickThumbnail(2);

    expect(slides()).toEqual(["slide3", "slide1", "slide2"]);
    expect(thumbnails()).toEqual(["thumb3", "thumb1", "thumb2"]);
  });

  it("ignores clicks that land on the strip but miss a thumbnail", async () => {
    await loadApp();

    document.querySelector(".carousel .thumbnail").click();

    expect(slides()).toEqual(["slide1", "slide2", "slide3"]);
    expect(carousel().className).toBe("carousel");
  });

  it("restarts the auto-play timer after a thumbnail is opened", async () => {
    await loadApp();

    vi.advanceTimersByTime(TIME_AUTO - 1000);
    clickThumbnail(2);
    expect(slides()).toEqual(["slide3", "slide1", "slide2"]);

    vi.advanceTimersByTime(TIME_AUTO - 1);
    expect(slides()).toEqual(["slide3", "slide1", "slide2"]);

    vi.advanceTimersByTime(1);
    expect(slides()).toEqual(["slide1", "slide2", "slide3"]);
  });
});
