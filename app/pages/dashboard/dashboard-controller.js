idtApp.controller('dashboardController', function($rootScope, $scope, $q, userService) {

	$scope.currentUser;
	loadCurrentUser();

	function loadCurrentUser() {

		userService.getcurrentUser().then(function(result)
		{
			$scope.currentUser = result;
			//Log current user
			console.log($scope.currentUser);
		});
		
	}

	function applyRemoteData(newTests){
		
	}

	function loadRemoteDataTests() {
		
	}

	

	function getnewUsers() {
		
	}

});
