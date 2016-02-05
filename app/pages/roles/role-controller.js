idtApp.controller('roleController', function($rootScope, $scope, $q, roleService, permissionService, notify)
{
	$rootScope.roles = [];
	$scope.permissions = [];
	$scope.selectedPermissions = [];
	$scope.selectedRoles = [];

	$scope.dropDownOptions = {
		selectAll       : "select all",
		selectNone      : "remove all",
		reset           : "reset",
		search          : "type to search",
	    nothingSelected : "select roles"
	};

	loadRoles();
	loadPermissions();

	$scope.addRole = function(){
		$scope.newRole.permissions = $scope.selectedPermissions;

		roleService.addRole($scope.newRole).then(function(data){
			loadRoles();
			closeLightbox();
			notify({
				"message" : '' + $scope.newRole.name + ' added to the database',
				'classes' : 'success'
			});
		});
	}

	$scope.setRoleToEdit = function(uuid){
		$rootScope.roleToEdit = getRoleById(uuid);
		$rootScope.selectedPermissionsEdit = selectPermissions($rootScope.roleToEdit);
	}

	$scope.editRole = function(uuid){
		roleService.editRole(uuid, $rootScope.roleToEdit).then(function(){
			notify({
		  		"message" : $rootScope.roleToEdit.name + ' has been updated.',
		  		'classes' : 'success'
		  	});
			loadRoles();
			closeLightbox();
		});
	}

	$scope.deleteRole = function(uuid, name){
		roleService.deleteRole(uuid).then(function(){
		  	notify({
		  		"message" : name + ' deleted from the database.',
		  		'classes' : 'success'
		  	});
			loadRoles();
		});
	}

	$scope.checkAll = function(){
		if($scope.roleMaster){
			$scope.selectedRoles = angular.copy($scope.roles);
		} else{
			$scope.selectedRoles = [];
		}
	}

	$scope.removeSelected = function(){
		console.log($scope.selectedRoles);
	}

	function selectPermissions(roleToEdit){
		loadPermissions();
		var thePermissions = $scope.permissions;
		$rootScope.roles.filter(function(role){
			if(role.name == roleToEdit.name){
				role.permissions.filter(function(permission){
					for(i in thePermissions){
						if(permission.uuid == thePermissions[i].uuid){
							thePermissions[i].selected = true;
						}
					}
				});
			}
		});
		return thePermissions;
	}

	function getRoleById(id){
		var theRole;
		$scope.roles.filter(function(role){
			if(role.uuid === id){
				theRole = role;
			}
		});
		return theRole;
	}

	function applyRoles(newRoles){
		$rootScope.roles = newRoles;
	}

	function loadRoles() {
		roleService.getRoles().then(function(roles){
			applyRoles(roles);
		});
	}

	function loadPermissions(){
		permissionService.getPermissions().then(function(permissions){
			$scope.permissions = permissions;
		});
	}
});
