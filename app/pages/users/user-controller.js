!idtApp.controller('userController', function($rootScope, $scope, $q, $http, userService, notify, Upload, $timeout,Login){

	//Empty array users
	$rootScope.users = [];
	//Empty Object currentuser
	$rootScope.currentuser = [];
	
	$scope.registerUser = function(callback){

		var prom = [];
		var user;
		prom.push(userService.addUser($scope.newUser, function(data){
			notify({
		  		"message" : $scope.newUser.name +  ' has been registered.',
		  		'classes' : 'success'
		  	});
			closeLightbox();

			Login.login($scope.newUser.email, $scope.newUser.password, function (data, status, headers, config) {
				//Call login function in the service
			}, function(data, status, headers, config) {
				// Failure handler
				console.error('Something went wrong while trying to register the user... ', data, status);
			});
		}));
	}

	function applyRemoteData(){
		//Dummy function
	}

	function loadRemoteData() {
		//Dummy function
	}
});