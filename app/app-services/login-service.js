'use strict';

angular.module('idtApp').factory('Login', function ($http, $resource,Cookies, $cookieStore,  $rootScope, $httpParamSerializer, $cookies, $location) {



	return {
		
		login: function(username, password, successHandler, errorHandler) {

			var clientid = "f3d259ddd3ed8ff3843839b";
			var clientsecret = "4c7f6f8fa93d59c45502c0ae8c4a95b";

			$rootScope.data = {grant_type:"password", username: username, password: password, client_id: clientid,client_secret: clientsecret };
			var req = {
            	method: 'POST',
            	url: "http://localhost:8000/oauth/access_token",
            	headers: {
                	"Content-type": "application/x-www-form-urlencoded; charset=utf-8"
            	},
            	data: $httpParamSerializer($rootScope.data)

       	}
        $http(req).then(function successCallback (data){
        	console.log(data);
            $http.defaults.headers.common.Authorization= 'Bearer ' + data.data.access_token;
            $cookies.put("access_token", data.data.access_token);
            $location.path('/dashboard');
        },function errorCallback(response) {
        	
  		});   
		},

		

		logout: function(successHandler, errorHandler) {

			var cookies = $cookies.getAll();
			angular.forEach(cookies, function (v, k) {
    			$cookies.remove(k);
			});

			$rootScope.authenticated = false;
		}
	};
});