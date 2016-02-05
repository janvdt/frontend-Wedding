idtApp.controller('testController', function($rootScope, $scope, $q, notify, testService, deviceService) {
	
	$rootScope.tests = [];
	$scope.devices = [];

	$scope.dropDownOptions = {
		selectAll       : "select all",
		selectNone      : "remove all",
		reset           : "reset",
		search          : "type to search",
	    nothingSelected : "select device"
	};

	loadRemoteData();
	loadDevices();

	$scope.addTest = function(){
		var test = formatInput($scope.newTest);

		testService.addTest(test).then(function(){
			closeLightbox();
			loadRemoteData();
			notify({
				"message" : '' + test.name + ' added to the test database.',
				'classes' : 'success'
			});
		});
	}

	$scope.setTestToEdit = function(uuid){
		$rootScope.testToEdit = getTestById(uuid);
		$rootScope.devicesToEdit = selectDevice($rootScope.testToEdit);
		loadRemoteData();
	};

	$scope.editTest = function(uuid){
		var test = formatInput($rootScope.testToEdit);

		testService.editTest(uuid, test).then(function(){
			notify({
		  		"message" : $rootScope.testToEdit.name + ' has been updated.',
		  		'classes' : 'success'
		  	});
			loadRemoteData();
			closeLightbox();
		});
	}

	$scope.deleteTest = function(uuid, name) {
		testService.deleteTest(uuid).then(function(){
			notify({
				"message" : name + ' deleted from the test database.',
				'classes' : 'success'
			});
			loadRemoteData();
		});
	}

	function formatInput(input){
		var test = {};

		test.name = input.name;
		test.numberOfTargets = Number(input.numberOfTargets);
		test.inputDevice = input.inputDevice[0];
		
		if(typeof input.targetAmplitudesInPixels == "string"){
			var amplitudesInPixels = input.targetAmplitudesInPixels.split(/[ ,:;]+/);
			test.targetAmplitudesInPixels = [ Number(amplitudesInPixels[0]),  Number(amplitudesInPixels[1]) ];
		} else{
			test.targetAmplitudesInPixels = input.targetAmplitudesInPixels;
		}
		
		if(typeof input.targetWidthsInPixels == "string"){
			var widthsInPixels = input.targetWidthsInPixels.split(/[ ,:;]+/);
			test.targetWidthsInPixels = [ Number(widthsInPixels[0]),  Number(widthsInPixels[1]) ];
		} else{
			test.targetWidthsInPixels = input.targetWidthsInPixels;
		}

		test.errorThreshold = Number(input.errorThreshold);
		test.spacialHysteresis = Number(input.spacialHysteresis);
		test.info = input.info;

		return test;
	}

	function selectDevice(theTest){
		loadDevices();
		allDevices = $scope.devices;
		$scope.devices.filter(function(device, i){
			if(device.uuid == theTest.inputDevice.uuid){
				allDevices[i].selected = true;
			}
		});
		return allDevices;
	}

	function getTestById(id){
		var theTest;
		$rootScope.tests.filter(function(test){
			if(test.uuid === id){
				theTest = test;
			}
		});
		return theTest;
	}

	function getDevices(){
		var prom  = [];
		var devices = [];
		prom.push(deviceService.getDevices().then(function(data){
			devices = data;
		}));
		$q.all(prom).then(function () {
			$scope.devices = devices;
		});
	}

	function loadDevices() {
		deviceService.getDevices().then(function(data){
			applyDevices(data);
		});
	}

	function applyDevices(newDevices){
		$scope.devices = newDevices;
	}

	function applyRemoteData(newTests){
		$rootScope.tests = newTests;
	}

	function loadRemoteData() {
		testService.getTests().then(function(tests){
			applyRemoteData(tests);
		});
	}
});

idtApp.controller('testDetailController', function($scope, $rootScope, $routeParams, $location, testService, userService) {
	var id = $routeParams.testId;

	$scope.test = null;

	testService.getTest(id).then(function(data){
		$scope.test = data;
		setDimensions();
		initSVG(data.numberOfTargets);
		updateCircles(25, 150, data.numberOfTargets);
		initTarget(data.numberOfTargets);

		var sequence = {};
		
		userService.getUser($rootScope.currentuser.principal.uuid).then(function(userResponse){
			sequence = {
				user: userResponse,
				specification: $scope.test,
				completed: 0,
				inputTests: []
			};

			testService.addSequence(sequence).then(function(data){
				$rootScope.sequenceId = data.uuid;
			});
		});
	});

	$scope.setColors = function(path){
		$rootScope.circleColor = $('.circle').css('fill');
		$rootScope.targetColor = $('.target').css('fill');
		$rootScope.displayColor = $('.display').css('backgroundColor');

		$location.path("tests/" + path + "/fitts");
	}
});

idtApp.controller('testStartController', function($scope, $rootScope, $routeParams, testService) {
	var id = $routeParams.testId;

	$scope.test = null;

	testService.getTest(id).then(function(data){
		$scope.test = data;
		testService.postTest($rootScope.sequenceId, $scope.test).then(function(data){
			initFitts($scope.test, $rootScope.sequenceId, data.uuid);
			setColor($rootScope.displayColor, $rootScope.targetColor, $rootScope.circleColor);
			$scope.test.trials = [];
			console.log($scope.test);
		});
	});
});