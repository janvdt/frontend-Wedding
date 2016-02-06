idtApp.controller('loginController', function ($rootScope,$httpParamSerializer, $cookies, $http, $location, $q, $resource, $scope, Cookies, Csrf, Login) {

	//User credentials empty
	$scope.credentials = {
		username: '',
		password: ''
	};
	

	//Login function called by the login form
	$scope.login = function () {
		Login.login($scope.credentials.username, $scope.credentials.password, function (data, status, headers, config) {
			//Call login Service where the magic happens
		}, function(data, status, headers, config) {
			// Failure handler
			console.error('Something went wrong while trying to login... ', data, status);
		});
	};

	function applyRemoteData(){
		//Dummy function
	}

	function loadCurrentData() {
		//Dummy function
	}
});