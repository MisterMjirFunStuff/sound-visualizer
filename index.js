var canvas = document.getElementsByTagName("canvas")[0];
var ctx = canvas.getContext("2d");
var heights = [];

resizeCanvas();

function resizeCanvas() {
  $("canvas").attr("width", $(window).outerWidth()).attr("height", $(window).height());
}

$(window).resize(function() {
  resizeCanvas();
});

const handleSuccess = function(stream) {
  const context = new AudioContext();
  const source = context.createMediaStreamSource(stream);
  const processor = context.createScriptProcessor(1024, 1, 1);

  source.connect(processor);
  processor.connect(context.destination);

  processor.onaudioprocess = function(e) {
    console.log(e.inputBuffer);
  };
};

navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(handleSuccess);


function wave(timestamp) {
  heights.push(100);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.moveTo(0, canvas.height / 2);
  ctx.lineTo(canvas.width, canvas.height / 2);
  ctx.closePath();
  ctx.stroke();
  for (var i = heights.length - 1, x = 0; i >= 0; i--, x++) {
    ctx.beginPath();
    ctx.moveTo(x, canvas.height / 2);
    ctx.lineTo(x, canvas.height / 2 - heights[i]);
    ctx.closePath();
    ctx.stroke();
  }

  requestAnimationFrame(wave);
}

requestAnimationFrame(wave);
