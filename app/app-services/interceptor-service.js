'use strict';

angular.module('idtApp').factory('httpRequestInterceptor', function ($q, $location) {
    return {
        'responseError': function(rejection) {
            // do something on error
            if(rejection.status === 404 || rejection.status === 401){
                //console.log(rejection.data.error_description);             
            }
            //console.log($q.reject(rejection));
            return $q.reject(rejection);
         }
     };
});