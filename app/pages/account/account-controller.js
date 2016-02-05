idtApp.controller('accountController', function($scope, $rootScope, userService,notify) {
	
	$scope.dynamic;
	$scope.showPassword = false;
	$scope.repeatPassword;

	loadRemoteData();

	$scope.changeInfo = function(uuid){
		userService.editUser(uuid, $scope.user).then(function(){
			notify({
		  		"message" : 'Account info updated.',
		  		'classes' : 'success'
		  	});
		  	userService.setUserImage($scope.user.uuid, $rootScope.imageUuid);
		  	$rootScope.imageUuid = null;
		  	loadRemoteData();
		});
	}

	$scope.checkPassword = function(uuid){
		userService.getUser(uuid).then(function(response){
			if($scope.dynamic.password != undefined)
			{
				userService.checkPassword(uuid,$scope.dynamic.password).then(function(response){
					if(response == true)
					{
						console.log("password is correct");
						$scope.showPassword = true;
					}
					else
					{
						console.log("passwoord is foutief");
						$scope.showPassword = false;
					}
				//console.log(response);
				});
			}else{
				$scope.showPassword = false;
			}
			
		});
	}

	$scope.changePassword = function(uuid)
	{
		console.log($scope.repeatPassword.password);
		console.log($scope.user.passwordHash);
		if($scope.user.passwordHash == $scope.repeatPassword.password)
		{
			userService.editUser(uuid, $scope.user).then(function(){
			$scope.showPassword = false;
			$scope.user.passwordHash = null;
			$scope.repeatPassword = null;
			$scope.dynamic = null;
			notify({
		  		"message" : $scope.user.firstName + ' ' + 'Your password has been changed.',
		  		'classes' : 'success'
		  		});
			});
		}
		else
		{
			notify({
		  		"message" : 'Passwords are not equal.',
		  		'classes' : 'success'
			});
		}
	}

	function loadRemoteData() {
		userService.getcurrentUser().then(function(currentUser){
			var uuid = currentUser.principal.uuid;
			userService.getUser(uuid).then(function(response){
			$scope.user = response;
			console.log($scope.user);
			});
		});
	}
});

