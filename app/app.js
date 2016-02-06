var idtApp = angular.module('idtApp', ['ngRoute', 'ngCookies', 'ngResource', 'ngFileUpload', 'cgNotify', 'angularUtils.directives.dirPagination' , 'isteven-multi-select', "checklist-model"]),permissionList;

var root ="http://localhost:8000";

idtApp.config(function($routeProvider, $httpProvider) {
  
  //Credentials for Cors
  $httpProvider.defaults.withCredentials = true;
  //Interceptor for requests to the server
  $httpProvider.interceptors.push('httpRequestInterceptor');

  // Routes for the different Controllers and Views
  $routeProvider
  .when('/', {
      templateUrl  : 'app/pages/dashboard/dashboard-view.html',
      controller   : 'dashboardController',
  })
  .when('/login', {
      templateUrl  : 'app/pages/login/login-view.html',
      controller   : 'loginController',
  })
  .when('/dashboard', {
      templateUrl  : 'app/pages/dashboard/dashboard-view.html',
      controller   : 'dashboardController',
  });
});


//Main Controller (To-Do make seperate controller)
idtApp.controller('mainController', function($rootScope, $cookies, $locale, $scope, $location, $http, notify) {

  notify.config({
    position: 'right',
    maximumOpen: 3
  }); 
	
  //Overlays for the different lightboxes
  $scope.overlays = [{ name: 'register-user', url: 'app/shared/lightbox/register-user.html' },];

  //Everytime the route(url) changes this get's triggered .
  $scope.$on('$routeChangeStart', function(scope, next, current) {
    
    //Not on the location of the login page .
    var isLoginPage = window.location.href.indexOf("login") != -1;
    

    // Check if user is still loggedin
    if(isLoginPage){
      if($cookies.get("access_token")){
        $rootScope.authenticated = true;
        $location.path('/dashboard')
      }
    }else{
      if($cookies.get("access_token")){
        $http.defaults.headers.common.Authorization= 'Bearer ' + $cookies.get("access_token");
        $rootScope.authenticated = true;
      }else{
        $rootScope.authenticated = false;
        $location.path('/login')
      }
    }
});

$scope.overlay = $scope.overlays[0];

//Show lightbox
$scope.showLightbox = function(template){
    $scope.overlay = $scope.overlays.filter(function(el){
      if(el.name == template) return el;
    });
    openLightbox();
}


//Close lightbox
$scope.closeLightbox = function(){
    closeLightbox();
}

//Tooltip
idtApp.directive('tooltip', function(){
  return {
    restrict: 'A',
    link: function(scope, element, attrs){
      $(element).hover(function(){
        element.prepend('<div class="tooltip animated fadeIn"><span>' + attrs.title + '</span></div>');
      }, function(){
          $('.tooltip').addClass('fadeOut');
       });
      }
    };
  });
});

