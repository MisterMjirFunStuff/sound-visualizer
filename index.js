/*
 * Resize canvas
 */
resizeCanvas();

function resizeCanvas() {
  $("canvas").attr("width", $(window).outerWidth()).attr("height", $(window).height());
}

$(window).resize(function() {
  resizeCanvas();
});

/*
 * Handle Audio
 * ------------
 * https://developer.mozilla.org/en-US/docs/Web/API/ScriptProcessorNode/onaudioprocess
 */
var audioPreciseness = 2; // Positive integer, the lower the more precise but the faster it displays
var multiplier = 100; // Most of the samples are really small decimals, bump them up

const handleSuccess = function(stream) {
  const context = new AudioContext();
  const source = context.createMediaStreamSource(stream);
  const processor = context.createScriptProcessor(1024, 1, 1);

  source.connect(processor);
  processor.connect(context.destination);

  processor.onaudioprocess = function(e) {
    // console.log(e.inputBuffer);
	var inputBuffer = e.inputBuffer;
	var outputBuffer = e.outputBuffer;

	for (var channel = 0; channel < outputBuffer.numberOfChannels; channel++) {
		var inputData = inputBuffer.getChannelData(channel);
		var outputData = outputBuffer.getChannelData(channel);

		for (var sample = 0; sample < inputBuffer.length; sample += audioPreciseness) {
			outputData[sample] = inputData[sample];
			heights.push(outputData[sample] * multiplier);
		}
	}
  };
};

navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(handleSuccess);

/*
 * Rainbow function
 * ----------------
 * http://www.nikolay.rocks/2015-10-29-rainbows-generator-in-javascript
 */
const rainbowRange = 1000000;
var rainbow = [];
for (var i = 0; i < rainbowRange; i++) {
	var red = sinToHex(i, 0 * Math.PI * 2 / 3);
	var blue = sinToHex(i, 1 * Math.PI * 2 / 3);
	var green = sinToHex(i, 2 * Math.PI * 2 / 3);

	rainbow.push("#" + red + green + blue);
}

function sinToHex(i, phase) {
	var sin = Math.sin(Math.PI / rainbowRange * 2 * i + phase);
	var int = Math.floor(sin * 127) + 128;
	var hex = int.toString(16);

	return hex.length === 1 ? "0" + hex : hex;
}

/*
 * Draw function
 */
var canvas = document.getElementsByTagName("canvas")[0];
var ctx = canvas.getContext("2d");
var heights = [];
var rainbowI = 0;
function wave(timestamp) {
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
	ctx.strokeStyle = rainbow[rainbowI + 1 < rainbowRange ? rainbowI++ : rainbowI = 0];
    ctx.stroke();
	if (x > canvas.width) {
		heights.splice(i);
	}
  }

  requestAnimationFrame(wave);
}

requestAnimationFrame(wave);

/*
 * Settings
 */
function toggleSettings() {
	if ($("#settings").hasClass("show")) {
		$("#settings").removeClass("show");
		$("#setting-toggle").css("color", "#333");
	} else {
		$("#settings").addClass("show");
		$("#setting-toggle").css("color", "#fff");
	}
}

function setPrecision() {
	precision = document.getElementById("precision").value;
}

function setHeight() {
	multiplier = document.getElementById("height").value;
}
