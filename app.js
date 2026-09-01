let nextDom = document.getElementById("next");
let prevDom = document.getElementById("prev");
let carouselDom = document.querySelector(".carousel");
let listItemDom = document.querySelector(".carousel .list");
let thumbnailDom = document.querySelector(".carousel .thumbnail");
let timeRunning = 1500;
let timeAuto = 5000;
let runTimeOut;

// The countdown bar on the active thumbnail is pure CSS, so hand it the delay
// used here instead of hard-coding the same number in both files.
carouselDom.style.setProperty("--time-auto", `${timeAuto}ms`);

let runAuto = setTimeout(() => {
  nextDom.click();
}, timeAuto);

nextDom.onclick = function () {
  showSlider("next");
};

prevDom.onclick = function () {
  showSlider("prev");
};

thumbnailDom.addEventListener("click", function (event) {
  openThumbnail(event.target.closest(".item"));
});

thumbnailDom.addEventListener("keydown", function (event) {
  if (event.key !== "Enter" && event.key !== " ") return;
  event.preventDefault();
  openThumbnail(event.target.closest(".item"));
});

for (let item of thumbnailDom.querySelectorAll(".item")) {
  item.setAttribute("role", "button");
  item.setAttribute("tabindex", "0");
}

// The thumbnails double as a picker. The first one is the slide already on
// screen, so opening the nth one means advancing n slides.
function openThumbnail(item) {
  if (!item) return;
  if (carouselDom.classList.contains("next")) return;
  if (carouselDom.classList.contains("prev")) return;

  let steps = Array.prototype.indexOf.call(thumbnailDom.children, item);
  if (steps < 1) return;

  // Skip the slides in between without animating, then let showSlider animate
  // the last hop so the chosen slide still grows out of a thumbnail.
  for (let i = 1; i < steps; i++) {
    listItemDom.appendChild(listItemDom.children[0]);
    thumbnailDom.appendChild(thumbnailDom.children[0]);
  }

  showSlider("next");
}

function showSlider(type) {
  let itemSlider = document.querySelectorAll(".carousel .list .item");
  let itemThumbnail = document.querySelectorAll(".carousel .thumbnail .item");

  if (type === "next") {
    listItemDom.appendChild(itemSlider[0]);
    thumbnailDom.appendChild(itemThumbnail[0]);
    carouselDom.classList.add("next");
  } else {
    let positionLastItem = itemSlider.length - 1;
    listItemDom.prepend(itemSlider[positionLastItem]);
    thumbnailDom.prepend(itemThumbnail[positionLastItem]);
    carouselDom.classList.add("prev");
  }

  clearTimeout(runTimeOut);
  runTimeOut = setTimeout(() => {
    carouselDom.classList.remove("next");
    carouselDom.classList.remove("prev");
  }, timeRunning);

  clearTimeout(runAuto);
  runAuto = setTimeout(() => {
    nextDom.click();
  }, timeAuto);
}
