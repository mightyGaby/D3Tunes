
// -- global Audio Vars --
var audioContext;
var arraybuffer;
var fftObject;
var audioSource;
var gainNode;
var samples = 1024;

// -- global var for svg --
var svg;


// ************************************
// ********** |\   ---  ***************
// ********** | |     | ***************
// ********** | |   --  ***************
// ********** | |     | ***************
// ********** |/   ---  ***************
// ************************************
// *** Data-Driven-Documents Domain ***
// ************************************


var colorGradient = d3.scale.linear()
    .domain([0.5, 0.75, 1])
    .range(['#ff0000', '#0000ff', '#00ff00']);

function d3Project(data){

  svg.selectAll('circle')
      .data(data)
      .enter()
        .append('circle');

  svg.selectAll('circle')
    .data(data)
        .attr('r', function(d){ return d/12 +'px';})
        .attr('cx', function(y, x){ return (100-(data.length/(x+1)))+'%';})
        .attr('cy', function(d){ return Math.abs(500-d*2) +'px';})
        .attr('class','bubble')
        .style('fill',function(d){ return colorGradient(120/d);})
        .style('opacity', function(d){ return d/200;});

    return svg;
}


// ************************************
// ********* Audio Handling ***********
// ************************************

function loadFile(mp3file) {
    var reqest = new XMLHttpRequest();
    reqest.open("GET", mp3file,true);
    reqest.responseType = "arraybuffer";
    reqest.onload = function() {
      audioContext.decodeAudioData(reqest.response, function(buffer) {
        audioBuffer = buffer;
        setAudioHandlers();
      });
    };
    reqest.send();
}


function setAudioHandlers() {

  var audioSource = audioContext.createBufferSource();
  audioSource.buffer = audioBuffer;
  fftObject = audioContext.createAnalyser();
  fftObject.fftSize = samples;
  audioSource.connect(fftObject);
  fftObject.connect(audioContext.destination);
  audioSource.start = audioSource.start || audioSource.noteOn;
  audioSource.start(0); // Drop the needle (play audio)

  var data = new Uint8Array(samples);

  setInterval(function(){
    fftObject.getByteFrequencyData(data);
    d3Project(data);
  }, 10); // repeat rendering project
}


window.onload = function(){

  svg = d3.select('body')
          .append('svg')
            .attr('width', '900px')
            .attr('height', '500px');

  audioContext = new webkitAudioContext();
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  loadFile('audio/bensound-jazzcomedy.mp3');

  //GAIN VARIABLES - for use when toggling sound on or off (>=1 if sound should be on)
  // gainNode = audioContext.createGain();
  // gainNode.gain.value = -1;

};
