<!-- STATUS BADGES — Centered row of status/deploy/test badges linked to monitoring repos -->
<div align='center'>

  [![demo][demo]][demo-link]
  [![status][status]][status-link]
  [![test][tests]][tests-link]

</div>

<!-- SCREENSHOT — Full-width centered screenshot of the app -->
<div align='center'>
  <a href='/'>
    <img
      src='screenshot.png'
      alt='Screenshot of the app'
      width='100%'
    />
  </a>
</div>

<!-- TITLE — Project title extracted from the app or README <h1> -->
<div align='center'>
  <h1>Image Slider with HTML, CSS and JavaScript</h1>
</div>

<!-- TECH STACK BADGES — Centered shields.io badges for each technology used -->
<div align='center'>

  [![HTML5][html]][html-link]
  [![CSS3][css]][css-link]
  [![JavaScript][javascript]][javascript-link]

</div>

<!-- SHORT DESCRIPTION — 1-2 sentences describing the project + quick links -->
<div align='center'>
  A sleek, animated image carousel/slider built with vanilla HTML, CSS, and JavaScript. Features smooth transitions, auto-play functionality, thumbnail navigation, and CSS keyframe animations.

  [Demo][demo-link] · [Report issue](/issues) · [Suggest something](/issues)
</div>

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running locally](#running-locally)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Demo](#demo)
- [Contributing](#contributing)
- [License](#license)

## Features

- [x] Fullscreen image carousel with smooth CSS animations
- [x] Auto-play with configurable interval (5 seconds)
- [x] Previous/Next navigation buttons
- [x] Thumbnail strip for quick slide preview
- [x] CSS keyframe animations for slide transitions (blur, translate, fade)
- [x] Animated background overlay on active slide content
- [x] Responsive layout with max-width constraints
- [x] Google Material Icons integration
- [x] Poppins font via Google Fonts
- [x] 7 themed robot slides with detailed descriptions

## Tech Stack

- [HTML5](https://developer.mozilla.org/en-US/docs/Web/HTML)
- [CSS3](https://developer.mozilla.org/en-US/docs/Web/CSS)
- [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [Google Fonts (Poppins)](https://fonts.google.com/specimen/Poppins)
- [Google Material Icons](https://fonts.google.com/icons)

## Getting Started

### Prerequisites

- Any modern web browser (Chrome, Firefox, Safari, Edge)
- A local HTTP server (optional, for serving images correctly)

### Installation

```bash
git clone https://github.com/wrujel/slider-static.git
cd slider-static
```

### Running locally

Open `index.html` directly in your browser, or use a local server:

```bash
# Using Python
python -m http.server 8080

# Using Node.js (npx)
npx serve .
```

Open [http://localhost:8080](http://localhost:8080) with your browser to see the result.

## Environment Variables

This project does not require any environment variables for basic usage.

## Project Structure

```
/
├── images/
├── app.js
├── index.html
├── styles.css
└── LICENSE
```

## Demo

You can check out the demo:

[![Demo][demo]][demo-link]

## Contributing

Contributions are welcome! If you have suggestions or find bugs, please open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the [MIT License](LICENSE).

---

<!-- BADGE REFERENCES -->
[html]: https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white
[css]: https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white
[javascript]: https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E

[html-link]: https://developer.mozilla.org/en-US/docs/Web/HTML
[css-link]: https://developer.mozilla.org/en-US/docs/Web/CSS
[javascript-link]: https://developer.mozilla.org/en-US/docs/Web/JavaScript

<!-- Status/Demo badges -->
[demo]: https://img.shields.io/badge/🚀%20Live%20Demo-000000?style=for-the-badge&&logoColor=white&color=0a6bdb
[status-link]: https://github.com/wrujel/monitor-repos
[tests-link]: https://github.com/wrujel/monitor-tests

[demo-link]: https://ephemeral-zuccutto-49ec06.netlify.app/
[status]: https://img.shields.io/endpoint?url=https%3A%2F%2Fraw.githubusercontent.com%2Fwrujel%2Fmonitor-repos%2Fmain%2Fdata%2Fslider-static.json
[tests]: https://img.shields.io/endpoint?url=https%3A%2F%2Fraw.githubusercontent.com%2Fwrujel%2Fmonitor-tests%2Fmain%2Fdata%2Fslider-static.json
