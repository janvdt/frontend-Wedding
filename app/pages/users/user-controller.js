!idtApp.controller('userController', function($rootScope, $scope, $q, $http, userService, notify, Upload, $timeout,Login){

	$rootScope.users = [];
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

			}, function(data, status, headers, config) {
			// Failure handler

				console.error('Something went wrong while trying to login... ', data, status);
			});
		}));

		
		
	}


	function applyRemoteData(newUsers){
		
	}

	function loadRemoteData() {
		
	}



    

});