var css = require('~/css/main.less');
var TriangulationApp = require('~/js/triangulation.js');
var main = document.querySelector('main');
var app = new TriangulationApp(main.offsetWidth, main.offsetHeight);
main.appendChild(app.node);
