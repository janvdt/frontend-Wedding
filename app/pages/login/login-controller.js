idtApp.controller('loginController', function ($rootScope,$httpParamSerializer, $cookies, $http, $location, $q, $resource, $scope, Cookies, Csrf, Login) {

	$scope.credentials = {
		username: '',
		password: ''
	};
	

	 (function initController() {
         // reset login status
         //console.log("lol");
       })();


	$scope.login = function () {
		Login.login($scope.credentials.username, $scope.credentials.password, function (data, status, headers, config) {
		}, function(data, status, headers, config) {
			// Failure handler
			console.error('Something went wrong while trying to login... ', data, status);
		});
		
    
	};

	function applyRemoteData(newUsers){

		
	}

	function loadCurrentData() {
		
	}

});