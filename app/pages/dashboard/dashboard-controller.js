idtApp.controller('dashboardController', function($rootScope, $scope, $q, userService,deviceService,reportService,testService) {

	$scope.currentuser;
	$scope.newestusers;
	$scope.newestActivity = [];
	loadCurrentUser();
	
	loadRemoteDataTests();

	function loadCurrentUser() {
		userService.getcurrentUser().then(function(result)
		{
			userService.getUser(result.principal.uuid).then(function(currentuser)
			{	
				//console.log(currentuser);
				$scope.currentuser = currentuser;
				$scope.getRoles( function () {
				//console.log($scope.users);
				});
				
			});
		});
	}

	function applyRemoteData(newTests){
		$rootScope.tests = newTests;
	}

	function loadRemoteDataTests() {
		testService.getTests().then(function(tests){
			applyRemoteData(tests);
		});
	}

	$scope.getRoles = function (callback) {
    	var prom = [];
    	
    		prom.push(userService.getUserRoles($scope.currentuser.uuid, function(value){
    			$rootScope.currentuser.roles = value.data;
    			//console.log($rootScope.currentuser.roles);
    			angular.forEach($rootScope.currentuser.roles, function(value, key) {
    				angular.forEach(value.permissions, function(value, key) {
    					//console.log(value.name);
    					if(value.name == "USER_ADMIN" && value.name != undefined)
    					{
    						getnewUsers();
							getActivity();
    					}
    				});
    			});

    		}));
    	$q.all(prom).then(function () {
    		callback();
    	});
    };

	function getnewUsers() {
		userService.getUsers().then(function(users){
			$scope.newestusers = users;
			//console.log(users);
		});
	}

	function getActivity(){
		userService.getUsers().then(function(users){
			$scope.newestActivity = users;
		});
		deviceService.getDevices().then(function(devices){
			angular.forEach(devices, function(value, key) {
  				$scope.newestActivity.push(value);
			});
			//console.log($scope.newestActivity);
		});
		reportService.getReports().then(function(reports){
			angular.forEach(reports, function(value, key) {
  				$scope.newestActivity.push(value);
			});
		});
	}
});
