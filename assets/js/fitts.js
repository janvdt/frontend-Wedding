var svg_width = 600;
var svg_height = 420;
var is_active = false;

var sequence = [];
var sequence_count = 0;

var total_count = 0;
var total_positions = [];

var inputTestTrial = [];
var mouseLocations = [];
var previousTarget;

var displayColor;
var targetColor;
var circleColor;

var testId;
var sequenceId;

function initFitts(data, seq, inputTestId){

	testId = inputTestId;
	sequenceId = seq;
	
	setDimensions();
	
	var count = 1;
	sequence = makeSequence(data.targetAmplitudesInPixels, data.targetWidthsInPixels);
	number_of_circles = data.numberOfTargets;
	
	startTest();

	var startLocation, stopLocation, startTime, stopTime, mouseDownTime, mouseLocations, hit;

	$("#svg").mousedown(function(e){
		is_active = true;
		target = $(e.target);
		
		if(target.is(".target")){
			hit = true;
		} else{
			hit = false;
		};

		startTime = +new Date();

	}).mouseup(function(e){
		startLocation = previousTarget;
		stopLocation = getTarget();
		stopTime = +new Date();
		mouseDownTime = startTime;

		if(count > 1){
			trackClick(startLocation, stopLocation, mouseDownTime, hit);
			console.log(inputTestTrial);
		}

		count = updateTarget(stopLocation, number_of_circles, count);
		$("#count").text(count);
	});

	$(document).on('click', '.continue', function(e){
		e.preventDefault();
		closeLightbox();
		startTest();
	});

	$(document).on('click', '.stop', function(e){
		closeLightbox();
	});

	$(document).on('click', '.get-results', function(e){
		getResults();
	});

	document.onmousemove = trackMouse;
}

function setDimensions(){
	svg_width = $(".display").width();
	svg_height = $('.display').height();
}

function setColor(dc, tc, cc){
	displayColor = dc;
	targetColor = tc;
	circleColor = cc;
	updateColor();
}

function updateColor(){
	$("#svg").find("circle").each(function(){
		$(this).css("fill", circleColor);
	});
	$('.display').css("backgroundColor", displayColor);
	$('.target').css("fill", targetColor);
}

function makeSequence(amplitudes, targetWidths){
	var i=0;
	var j=0;
	var h=0;

	var theSequence = [];

	for(i;i<amplitudes.length;i++){
		for(j;j<targetWidths.length;j++){
			theSequence[h] = {
				amplitudes: amplitudes[i],
				targetWidths: targetWidths[j]
			};
			h++;
		}
		j=0;
	}

	return theSequence;
}

function startTest(){
	var circle_distance = sequence[sequence_count].amplitudes;
	var circle_radius = sequence[sequence_count].targetWidths;

	$("#total_count").text("/"+number_of_circles);
	$("#sequence-count").text((sequence_count + 1) + "/");
	$("#total-sequence-count").text(sequence.length);
	
	clearCanvas();
	// initialize SVG object and circles
	initSVG(number_of_circles);
	// set initial circle values
	updateCircles(circle_radius, circle_distance, number_of_circles);
	// set first target
	initTarget(number_of_circles);
	// set color
	updateColor();
}

function initSVG(number_of_circles){
	var svg = document.getElementById('svg');

	for(var i = 0; i < number_of_circles; i++){
		var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
		svg.appendChild(circle);
	}
}

function updateCircles(radius, distance, number_of_circles){
	var angle = 0;
	var x, y;
	var increase = Math.PI * 2 / number_of_circles;

	$("#svg").find("circle").each(function(){
		// increase angle radians and set circle positions
		angle += increase;
		x = distance * Math.cos(angle) + (svg_width / 2);
		y = distance * Math.sin(angle) + (svg_height / 2);
		$(this).attr({'r': radius, 'cx': x, 'cy': y, 'angle': angle, 'clicked': 'false', 'class': 'circle'});
	});
}

function updateTarget(index, number_of_circles, count){
	var next_target;
	var greatest_distance = 0;

	var current_x = $("circle")[index].getAttribute('cx');
	var current_y = $("circle")[index].getAttribute('cy');
	var current_angle = $("circle")[index].getAttribute('angle');

	$("circle")[index].setAttribute('clicked', 'true');

	$("circle").each(function(){
		var x = $(this).attr("cx");
		var y = $(this).attr("cy");
		var clicked = $(this).attr("clicked");

		if(clicked == 'false'){
			var dx = current_x - x;
			var dy = current_y - y;
			var distance = Math.sqrt((dx*dx) + (dy*dy));
			if(distance > greatest_distance){
				greatest_distance = distance;
				next_target = $(this).index();
			}
		}
	});

	// remove old target
	previousTarget = index;
	$("#svg .target")[0].removeAttribute('class');

	if(count == number_of_circles){
		resetTest(number_of_circles);

		return 1;
	} else{
		// set new target
		$("#svg circle")[next_target].setAttribute('class', 'target');
		updateColor();
		count = count + 1;

		return count;
	}
}

function initTarget(number_of_circles){
	targetIndex = Math.floor((Math.random() * number_of_circles) + 0);

	previousTarget = targetIndex;

	$("#svg circle").each(function(){
		if($(this).index() == targetIndex){
			$(this).attr('class', 'target');
		}
	});
}

function trackClick(startLocation, stopLocation, mouseDownTime, hit) {
	inputTestTrial.push({
		startLocation: getCoordinates(startLocation),
		stopLocation: getCoordinates(stopLocation),
		startTime: mouseLocations[0].t, 
		stopTime: +new Date(),
		mouseDownTime: mouseDownTime,
		mouseLocations: mouseLocations,
		hit: hit
	});

	drawClick(hit);

	mouseLocations = [];
}

function trackMouse() {
	// get mouse position
	var x = getMousePosition(event).x;
	var y = getMousePosition(event).y;
	var t = getMousePosition(event).t;

	if(y < svg_height && y > 0 && x < svg_width && x > 0){
		// save path
		if(is_active){
			mouseLocations.push({x: x, y: y, t: t});
			drawPath();
		}
	}
}

function getMousePosition(event){
	var x = event.pageX - $("#svg").offset().left;
	var y = event.pageY - $("#svg").offset().top;
	var t = (new Date).getTime();

	return {x: x, y: y, t: t};
}

function drawPath(){
	var svg = document.getElementById('svg-mouse');
	var arr_length = mouseLocations.length;

	if(arr_length > 1){
		var x1 = mouseLocations[arr_length - 2].x / 2;
		var x2 = mouseLocations[arr_length - 1].x / 2;
		var y1 = mouseLocations[arr_length - 2].y / 2;
		var y2 = mouseLocations[arr_length - 1].y / 2;
		var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');

		line.setAttribute('x1', x1);
		line.setAttribute('x2', x2);
		line.setAttribute('y1', y1);
		line.setAttribute('y2', y2);
		line.setAttribute('stroke', 'black');

		svg.appendChild(line);
	}
}

function drawClick(hit){
	var svg = document.getElementById('svg-mouse');
	var arr_length = mouseLocations.length;

	var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
	
	if(arr_length != 0 ){
		var x = mouseLocations[arr_length - 1].x / 2;
		var y = mouseLocations[arr_length - 1].y / 2;

		circle.setAttribute('r', 10);
		circle.setAttribute('cx', x);
		circle.setAttribute('cy', y);

		if(!hit) circle.setAttribute('class','error');
		
		svg.appendChild(circle);
	}
}

function getTarget(){
	var target;
	target = $("#svg").find('.target').index();

	return target;
}

function getCoordinates(index){
	var target, x, y;
	target = $("#svg").find('circle')[index];
	x = $(target).attr('cx');
	y = $(target).attr('cy');

	return {x: x, y: y};
}

function resetTest(number_of_circles){
	total_positions[total_count] = {
		inputTestTrial, 
		amplitude: sequence[sequence_count].amplitudes,
		radius: sequence[sequence_count].targetWidths,
		startTime: inputTestTrial[0].startTime,
		stopTime: inputTestTrial[inputTestTrial.length - 1].stopTime
	};

	sequence_count++;

	// reset targets
	$("circle").each(function(){
		$(this).attr('clicked', 'false');
	});

	calculateResult();
	is_active = false;
	total_count++;

	if(total_count == sequence.length){
		stopTest();
	} else{
		pauseTest();
	}

	inputTestTrial = [];
}

function clearCanvas(){
	$("#svg-mouse").empty();
	$("#svg").empty();
}

function calculateResult(){
	console.log(total_positions);
}

function pauseTest(){
	angular.element('#mainController').scope().showLightbox('pause-test');
	angular.element('#mainController').scope().postTrial(testId, sequenceId, inputTestTrial);
	angular.element('#mainController').scope().$apply();
}

function stopTest(){
	angular.element('#mainController').scope().showLightbox('stop-test');
	angular.element('#mainController').scope().postTrial(testId, sequenceId, inputTestTrial);
	angular.element('#mainController').scope().$apply();
}

function getResults(){
	angular.element('#mainController').scope().closeLightbox();
	angular.element('#mainController').scope().$apply();
}