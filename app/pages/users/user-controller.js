!idtApp.controller('userController', function($rootScope, $scope, $q, $http, userService, roleService, notify, Upload, $timeout){

	$rootScope.users = [];
	$rootScope.currentuser = [];
	$scope.selectedRoles = [];
	
	$scope.dropDownOptions = {
		selectAll       : "select all",
		selectNone      : "remove all",
		reset           : "reset",
		search          : "type to search",
	    nothingSelected : "select roles"
	};

	loadRemoteData();

	$scope.setUserToEdit = function(uuid){
		$rootScope.userToEdit = getUserById(uuid);
		$rootScope.imageUuid = $rootScope.userToEdit.userImage;
		selectRoles($rootScope.userToEdit.roles, function(theRoles){
			$rootScope.selectedRolesEdit = theRoles;
		});
	};

	$scope.upload = function (file) {
        Upload.upload({
            url: root + '/rest/uploads/doUpload',
            data: {file: file}
        }).then(function (resp) {
            $rootScope.imageUuid = resp.data;
            //console.log($scope.imageUuid);
        }, function (resp) {
            console.log('Error status: ' + resp.status);
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });
    };

	$scope.addUser = function(callback){
		var prom = [];
		var user;
		prom.push(userService.addUser($scope.newUser, function(data){
			user = data;
		}));
    	$q.all(prom).then(function () {
    		if($rootScope.imageUuid != null){
    			userService.setUserImage(user.uuid, $rootScope.imageUuid);
    		}
    		$rootScope.imageUuid == null;
    		var rolesToAdd = [];
    		$scope.selectedRoles.filter(function(role){
    			if(role.ticked){
    				rolesToAdd.push(role);
    			}
    		});
			userService.setRoles(user.uuid, rolesToAdd).then(function(){
				loadRemoteData();
				closeLightbox();
				notify({
					"message" : '' + $scope.newUser.firstName + ' ' + $scope.newUser.lastName + ' added to the user database.',
					'classes' : 'success'
				});
			});
    	});
	}

	$scope.editUser = function(uuid){
		userService.editUser(uuid, $rootScope.userToEdit).then(function(){
			if($rootScope.imageUuid != null){
				userService.setUserImage($rootScope.userToEdit.uuid, $rootScope.imageUuid);
				$rootScope.imageUuid = null;
			}

			var userRoles = $rootScope.userToEdit.roles;
			selectRoles(userRoles, function(theRoles){
				var rolesToDelete = []; 
				var rolesToAdd = [];
				theRoles.filter(function(role){
					if(!role.selected){
						rolesToDelete.push({"uuid": role.uuid});
					} else{
						rolesToAdd.push({"uuid": role.uuid});
					}
				});
				
				userService.deleteRoles(uuid, rolesToDelete).then(function(){
					userService.editRoles(uuid, rolesToAdd).then(function(){
						notify({
							"message" : $rootScope.userToEdit.firstName + ' ' + $rootScope.userToEdit.lastName + ' has been updated.',
							'classes' : 'success'
						});
						loadRemoteData();
						closeLightbox();
					});
				});
			});
		});
		/*

		selectRoles($rootScope.userToEdit.roles, function(theRoles){
			var userRoles = $rootScope.userToEdit.roles;
			var rolesToDelete = [];
			theRoles.filter(function(role){
				if(!role.selected){
					rolesToDelete.push(role);
				}
			});
			console.log(userRoles, rolesToDelete);
			userService.deleteRoles(uuid, rolesToDelete).then(function(){
				notify({
					"message" : $rootScope.userToEdit.firstName + ' ' + $rootScope.userToEdit.lastName + ' has been updated.',
					'classes' : 'success'
				});
				loadRemoteData();
				closeLightbox();
			});
		});
		*/
		/*selectRoles($rootScope.userToEdit.roles, function(theRoles){
			var rolesToDelete = [];
			theRoles.filter(function(role){
				if(!role.selected){
					rolesToDelete.uuid = role.uuid;
				}
			});
			console.log(rolesToDelete);
			userService.deleteRoles(uuid, rolesToDelete).then(function(){
				userService.editUser(uuid, $rootScope.userToEdit).then(function(){
					notify({
						"message" : $rootScope.userToEdit.firstName + ' ' + $rootScope.userToEdit.lastName + ' has been updated.',
						'classes' : 'success'
					});
					loadRemoteData();
					closeLightbox();
				});

			});
		});*/
	}

	$scope.lockUser = function(uuid){
		var user = getUserById(uuid);
		user.active = !user.active;
		userService.setActive(uuid, user.active).then(function(){
			loadRemoteData();
			var message = (user.active ? "active" : "inactive");
			notify({
				"message" : '' + user.firstName + ' ' + user.lastName + ' is now ' + message,
				'classes' : 'success'
			});
		});
	}

	$scope.deleteUser = function(uuid, firstName, lastName){
		userService.deleteUser(uuid).then(loadRemoteData);
	  	
	  	notify({
	  		"message" : '' + firstName + ' ' + lastName + ' deleted from the user database.',
	  		'classes' : 'success'
	  	});
	}

	function getUserById(id){
		var theUser;
		$scope.users.filter(function(user){
			if(user.uuid === id){
				theUser = user;
			}
		});
		return theUser;
	}

	function applyRemoteData(newUsers){
		$rootScope.users = newUsers;
	}

	function loadRemoteData() {
		userService.getUsers().then(function(users){
			applyRemoteData(users);
			$scope.getRoles( function () {
				//console.log($scope.users);
			});
		});
	}

	$scope.getRoles = function (callback) {
    	var prom = [];
    	$scope.users.forEach(function (obj, i) {
    		prom.push(userService.getUserRoles(obj.uuid, function(value){
    			$scope.users[i].roles = value.data;
    		}));
    	});
    	$q.all(prom).then(function () {
    		callback();
    	});
    };

    function selectRoles(theRoles, callback){
    	var prom = [];
    	var myRoles = [];
		prom.push(roleService.getRoles().then(function(roles){
			myRoles = roles;
		}));
		$q.all(prom).then(function () {
    		theRoles.filter(function(role){
				for(i in myRoles){
					if(role.uuid == myRoles[i].uuid){
						myRoles[i].selected = true;
					}
				}
			});
			callback(myRoles);
    	});
	};

});