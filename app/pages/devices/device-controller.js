idtApp.controller('deviceController', function($rootScope, $scope, $q, notify, deviceService,Upload, $timeout) {

	$rootScope.devices = [];
	
	loadRemoteData();

	$scope.setDeviceToEdit = function(uuid){
		$rootScope.deviceToEdit = getDeviceById(uuid);
		$rootScope.imageUuid = $rootScope.deviceToEdit.inputdeviceImage;
		//console.log($rootScope.userToEdit);
		//$rootScope.userToEditRole = userService.getUserRoles($rootScope.userToEdit.uuid);
		//$rootScope.allRoles = roleService.getRoles();
		//console.log($rootScope.allRoles);
		//console.log($rootScope.userToEditRole);
	}

	$scope.deleteImage = function(uuid){
		deviceService.deleteImage(uuid).then(function(){
	  	notify({
	  		"message" : 'Image deleted from the database.',
	  		'classes' : 'success'
	  	});
	  	$rootScope.imageUuid = null;
	  });
	}

	$scope.upload = function (file) {
        Upload.upload({
            url: root + '/rest/uploads/doUpload',
            data: {file: file}
        }).then(function (resp) {
            $rootScope.imageUuid = resp.data;
        }, function (resp) {
            console.log('Error status: ' + resp.status);
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });
    };

	function getDeviceById(id){
		var theDevice;
		$scope.devices.filter(function(device){
			if(device.uuid === id){
				theDevice = device;
			}
		});
		return theDevice;
	}

	$scope.clearImage = function(){
		//console.log("lohoool");
		$rootScope.imageUuid = null;
	}

	$scope.editDevice = function(uuid){
		//console.log($rootScope.deviceToEdit);
		deviceService.editDevice(uuid, $rootScope.deviceToEdit).then(function(){
			notify({
		  		"message" : $rootScope.deviceToEdit.name +  ' has been updated.',
		  		'classes' : 'success'
		  	});
		  	deviceService.setInputdeviceImage($rootScope.deviceToEdit.uuid, $rootScope.imageUuid);
			$rootScope.imageUuid = null;
			loadRemoteData();
			closeLightbox();
		});
	}

	$scope.addDevice = function(callback){
		var prom = [];
		var device;
		//console.log($scope.newDevice);
		prom.push(deviceService.addDevice($scope.newDevice, function(data){
			device = data;
		}));
		$q.all(prom).then(function () {
			if($rootScope.imageUuid != null){
			deviceService.setInputdeviceImage(device.uuid, $rootScope.imageUuid);
			}
			$rootScope.imageUuid = null;
			notify({
					"message" : '' + $scope.newDevice.name + ' ' + ' added to the user database.',
					'classes' : 'success'
			    });
			loadRemoteData();
			closeLightbox();
			});
		

	}

	$scope.deleteDevice = function(uuid, name){
		deviceService.deleteDevice(uuid).then(loadRemoteData);
	  	
	  	notify({
	  		"message" : '' + name +' deleted from the device database.',
	  		'classes' : 'success'
	  	});
	}

	function applyRemoteData(newDevices){
		$rootScope.devices = newDevices;
		console.log($rootScope.devices);
	}

	function loadRemoteData() {
		console.log($rootScope.imageUuid);
		deviceService.getDevices().then(function(devices){
			applyRemoteData(devices);
		});
	}

});