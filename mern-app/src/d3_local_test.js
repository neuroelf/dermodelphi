global.fetch = require('node-fetch');
var d3 = require('d3');

function render(data) {
    var svg = d3.select('svg');
    console.log(data);
}

d3.json('https://cdn.jsdelivr.net/gh/neuroelf/dermodelphi@master/mern-app/src/json/dm_diagnoses.json').then(data => render(data));

