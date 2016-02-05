idtApp.service('permissionService', function($http, $q) {
    return({
      getPermissions: getPermissions
    });

    function getPermissions(){
      var request = $http.get(root + '/rest/permissions');
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