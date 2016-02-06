idtApp.service('userService', function($http, $q) {
  
//Declare functions in userService
  return({
    getcurrentUser: getcurrentUser,
    addUser:addUser,
  });

  //Get the user that is logged on
  function getcurrentUser(){
    var request = $http.get(root + '/api');
    return (request.then(handleSuccess, handleError));
  }

  //Add new user to the system
  function addUser(user, callback){
    return $http.post(root + '/register', user).success(
    function(value) {
      return callback(value);
    });
  }

  // Handle Successfull Call to the server
  function handleSuccess(response){
    return (response.data);
  }

  //Handle Error when performing Call to server
  function handleError(reponse){
    if(!angular.isObject(reponse.data) || !response.data.message){
      return $q.reject("An unknown error occured");
    }
    return ($q.reject(reponse.data.message));
  }
});