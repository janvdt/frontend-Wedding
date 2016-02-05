idtApp.controller('navigationController', function ($scope, $location, $rootScope, $cookies, $http, $location, $q, $resource, $scope, Cookies, Csrf) {

	$scope.credentials = {
		username: '',
		password: ''
	};

	$scope.isActive = function(route) {
		return route.split('/')[1] === $location.path().split('/')[1];
	}

	$scope.logout = function() {
		
	};

});