idtApp.service('deviceService', function($http, $q) {

return({
      addDevice: addDevice,
      getDevices: getDevices,
      deleteDevice: deleteDevice,
      editDevice : editDevice,
      setInputdeviceImage : setInputdeviceImage,
      deleteImage : deleteImage
    });

 function addDevice(device, callback){
      return $http.post(root + '/rest/inputdevices', device).success(
        function(value) {
          return callback(value);
        }
      );
    }
  
    function getDevices(){
      var request = $http.get(root + '/rest/inputdevices');
      return (request.then(handleSuccess, handleError));
    }

    function editDevice(uuid,device){
      var request = $http.patch(root + '/rest/inputdevices/' + uuid,device);
      return (request.then(handleSuccess, handleError));
    }

    function deleteDevice(uuid){
      var request = $http.delete(root + '/rest/inputdevices/' + uuid);
      return (request.then(handleSuccess, handleError));
    }

     function setInputdeviceImage(uuid,inputdeviceImage) {
      console.log("1 : " + uuid);
      console.log("2 : " + inputdeviceImage);
      var request = $http.post(root + '/rest/inputdevices/' + uuid + '/uploads', inputdeviceImage);
      return (request.then(handleSuccess, handleError));
    }

    function deleteImage(uuid){
      var request = $http.delete(root + '/rest/uploads/' + uuid);
      return (request.then(handleSuccess, handleError));
    }

    function handleSuccess(response){
      return (response.data);
    }

    function handleError(reponse){
      if(!angular.isObject(reponse.data) || !response.data.message){
        return $q.reject("An unknown error occured");
      }
      return ($q.reject(reponse.data.message));
    }

});