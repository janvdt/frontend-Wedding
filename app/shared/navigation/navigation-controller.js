idtApp.controller('navigationController', function ($scope, $location, $rootScope, $cookies, $http, $location, $q, $resource, $scope, Cookies, Csrf, Login) {

	$scope.credentials = {
		username: '',
		password: ''
	};

	$scope.isActive = function(route) {
		return route.split('/')[1] === $location.path().split('/')[1];
	}

	$scope.logout = function() {

		Login.logout(function (data, status, headers, config) {		

		}, function(data, status, headers, config) {
			// Failure handler
			console.error('Something went wrong while trying to logout... ', data, status);
		});
		
	};

});