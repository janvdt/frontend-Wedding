'use strict';

angular.module('idtApp').factory('Login', function ($http, $resource,Cookies, $cookieStore,  $rootScope, $httpParamSerializer, $cookies, $location,notify) {

	return {
		
		login: function(username, password, successHandler, errorHandler) {

			//clientId Website
			var clientid = "f3d259ddd3ed8ff3843839b";
			//clientSecret Website
			var clientsecret = "4c7f6f8fa93d59c45502c0ae8c4a95b";

			// Data that has to be send to server for authentication
			$rootScope.data = {grant_type:"password", username: username, password: password, client_id: clientid,client_secret: clientsecret };
			var req = {
            	method: 'POST',
            	url: root + "/oauth/access_token",
            	headers: {
                	"Content-type": "application/x-www-form-urlencoded; charset=utf-8"
            	},
            	//Serialise Data
            	data: $httpParamSerializer($rootScope.data)

       	}
        $http(req).then(function successCallback (data){
        	//Succesfull call to server and receie token
            $http.defaults.headers.common.Authorization= 'Bearer ' + data.data.access_token;
            $cookies.put("access_token", data.data.access_token);
            $location.path('/dashboard');
        },function errorCallback(response) {
			//Notify when credentials are Wrong!! ( 401)
			notify({
		  		"message" : response.data.error_description +  ' .',
		  		'classes' : 'success'
		  });
  		});   
		},

		

		logout: function(successHandler, errorHandler) {

			//Get All cookies
			var cookies = $cookies.getAll();
			//loop and delete cookies for logout
			angular.forEach(cookies, function (v, k) {
    			$cookies.remove(k);
			});

			//Authentication false
			$rootScope.authenticated = false;
		}
	};
});