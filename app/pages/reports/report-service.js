idtApp.service('reportService', function($http, $q) {

	return({
      getReports: getReports
    });

	function getReports(){
      var request = $http.get(root + '/rest/inputtestsequences');
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