idtApp.service('userService', function($http, $q) {
    return({
      addUser: addUser,
      getUser : getUser,
      getUsers: getUsers,
      getUserRoles: getUserRoles,
      getcurrentUser: getcurrentUser,
      setRoles: setRoles,
      setActive: setActive,
      deleteUser: deleteUser,
      deleteRoles: deleteRoles,
      editRoles: editRoles,
      editUser : editUser,
      getUser : getUser,
      setUserImage : setUserImage,
      checkPassword : checkPassword
    });

    function addUser(user, callback){
      return $http.post(root + '/rest/users', user).success(
        function(value) {
          return callback(value);
        }
      );
    }

    function setUserImage(uuid,userImage) {
      console.log("1 : " + uuid);
      console.log("2 : " + userImage);
      var request = $http.post(root + '/rest/users/' + uuid + '/uploads', userImage);
      return (request.then(handleSuccess, handleError));
    }
  
    function getUsers(){
      var request = $http.get(root + '/rest/users');
      return (request.then(handleSuccess, handleError));
    }

    function getUser(uuid){
      var request = $http.get(root + '/rest/users/' + uuid);
      return (request.then(handleSuccess, handleError));
    }

    function getUserRoles(id, callback) {
      return $http.get(root + "/rest/users/" + id + "/roles").then(
        function(response) {
          return callback(response);
        }
      );
    }

    function setRoles(uuid, roles) {
      var request = $http.post(root + '/rest/users/' + uuid + '/roles', roles);
      return (request.then(handleSuccess, handleError));
    }

    function deleteRoles(uuid, roles){
      var request = $http.put(root + '/rest/users/' + uuid + '/roles', roles);
      return (request.then(handleSuccess, handleError));
    }

    function editRoles(uuid, roles){
      var request = $http.patch(root + '/rest/users/' + uuid + '/roles', roles);
      return (request.then(handleSuccess, handleError));
    }

    function getcurrentUser(){
      var request = $http.get(root + '/rest/users/user');
      return (request.then(handleSuccess, handleError));
    }

    function setActive(uuid, is_active){
      var request = $http.patch(root + '/rest/users/' + uuid + '/state', {active:is_active});
      return (request.success(handleSuccess, handleError));
    }

    function editUser(uuid, user){
      var request = $http.patch(root + '/rest/users/' + uuid, user);
      return (request.then(handleSuccess, handleError));
    }

    function checkPassword(uuid,password)
    {
      var request = $http.post(root + '/rest/users/' + uuid + '/getpassword', password);
      return (request.then(handleSuccess, handleError));
    }

    function deleteUser(uuid){
      var request = $http.delete(root + '/rest/users/' + uuid);
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