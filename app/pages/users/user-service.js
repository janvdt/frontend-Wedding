idtApp.service('userService', function($http, $q) {
    return({
      getcurrentUser: getcurrentUser,
      addUser:addUser,
    });

    function getcurrentUser(){
      var request = $http.get(root + '/api');
      return (request.then(handleSuccess, handleError));
    }

    function addUser(user, callback){
      return $http.post(root + '/register', user).success(
        function(value) {
          return callback(value);
        }
      );
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