idtApp.service('roleService', function($http, $q) {
    return({
      addRole: addRole,
      getRoles: getRoles,
      getRole: getRole,
      getUserRoles: getUserRoles,
      editRole: editRole,
      deleteRole: deleteRole
    });

    function addRole(role){
      var request = $http.post(root + '/rest/roles', role);
      return (request.then(handleSuccess, handleError));
    }

    function getUserRoles(userId){
      var request = $http.get(root + '/rest/users/' + userId + '/roles');
      return (request.then(handleSuccess, handleError));
    }
  
    function getRole(uuid){

    }

    function editRole(uuid, role){
      var request = $http.put(root + '/rest/roles/' + uuid, role);
      return (request.then(handleSuccess, handleError));
    }

    function getRoles(){
      var request = $http.get(root + '/rest/roles');
      return (request.then(handleSuccess, handleError));
    }

    function deleteRole(uuid){
      var request = $http.delete(root + '/rest/roles/' + uuid);
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