idtApp.controller('loginController', function ($rootScope, $cookies, $http, $location, $q, $resource, $scope, Cookies, Csrf, Login, userService, permissions) {

	$scope.credentials = {
		username: '',
		password: ''
	};

	 (function initController() {
         // reset login status
         Login.ClearCredentials();
         //console.log("lol");
       })();

	$rootScope.permissionList;

	$scope.login = function () {
		Login.login($scope.credentials.username, $scope.credentials.password, function (data, status, headers, config) {
			// Success handler
			loadCurrentData();
			console.info('The user has been successfully logged in! ', data, status);
			Login.SetCredentials($scope.credentials.username, $scope.credentials.password);
			$location.url('/');
			$rootScope.authenticated = true;
		}, function(data, status, headers, config) {
			// Failure handler
			console.error('Something went wrong while trying to login... ', data, status);
		});
	};

	function applyRemoteData(newUsers){

		$rootScope.currentuser = newUsers;
		//console.log($rootScope.currentuser);
		permissionList = $rootScope.currentuser.authorities;
		//console.log(permissionList);
		permissions.setPermissions(permissionList);
	}

	function loadCurrentData() {
		userService.getcurrentUser().then(function(users){
			applyRemoteData(users);
		});
	}

});