idtApp.service('testService', function($http, $q) {
    return({
      addTest: addTest,
      postTest: postTest,
      postTrial: postTrial,
      addSequence: addSequence,
      getTests: getTests,
      getTest: getTest,
      editTest: editTest,
      deleteTest: deleteTest
    });

    function addTest(test){
      var request = $http.post(root + '/rest/inputtestspecifications', test);
      return (request.then(handleSuccess, handleError));
    }
  
    function addSequence(data){
      var request = $http.post(root + '/rest/inputtestsequences', data);
      return (request.then(handleSuccess, handleError));
    }

    function postTest(sequenceId, data){
      var request = $http.post(root + "/rest/inputtestsequences/" + sequenceId + "/inputtests", data);
      console.log(data);
      return (request.then(handleSuccess, handleError));
    }

    function postTrial(testId, sequenceId, data){
      var request = $http.post(root + "/rest/inputtestsequences/" + sequenceId + "/inputtests/" + testId + "/trials", data);
      console.log(data);
      return (request.then(handleSuccess, handleError));
    }

    function getTests(){
      var request = $http.get(root + '/rest/inputtestspecifications');
      return (request.then(handleSuccess, handleError));
    }

    function getTest(uuid){
      var request = $http.get(root + '/rest/inputtestspecifications/' + uuid);
      return (request.then(handleSuccess, handleError));
    }

    function editTest(uuid, test){
      var request = $http.put(root + '/rest/inputtestspecifications/' + uuid, test);
      return (request.then(handleSuccess, handleError));
    }

    function deleteTest(uuid){
      var request = $http.delete(root + '/rest/inputtestspecifications/' + uuid);
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