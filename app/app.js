var idtApp = angular.module('idtApp', ['ngRoute', 'ngCookies', 'ngResource', 'ngFileUpload', 'cgNotify', 'angularUtils.directives.dirPagination' , 'isteven-multi-select', "checklist-model"]),permissionList;

//var root = "http://146.175.138.153/tomcat/idt-backend";
var root ="http://localhost:8000";



idtApp.config(function($routeProvider, $httpProvider) {
  
  $httpProvider.defaults.withCredentials = true;
  // Tough luck: the default cookie-to-header mechanism is not working for cross-origin requests!
  $httpProvider.defaults.xsrfCookieName = 'CSRF-TOKEN'; // The name of the cookie sent by the server
  $httpProvider.defaults.xsrfHeaderName = 'X-CSRF-TOKEN'; // The default header name picked up by Spring Security
  $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
  $httpProvider.interceptors.push('httpRequestInterceptor');

  $routeProvider
  .when('/', {
       templateUrl  : 'app/pages/dashboard/dashboard-view.html',
       controller   : 'dashboardController',
       //permission   : 'LOGON',
   })
  .when('/login', {
       templateUrl  : 'app/pages/login/login-view.html',
       controller   : 'loginController',
   })
	.when('/dashboard', {
       templateUrl  : 'app/pages/dashboard/dashboard-view.html',
       controller   : 'dashboardController',
       permission   : 'LOGON',
   });
   

});



idtApp.controller('mainController', function($rootScope, $cookies, $locale, $scope, $location, $http, notify) {

    notify.config({
      position: 'right',
      maximumOpen: 3
    }); 
	
    $scope.overlays = [
      { name: 'register-user', url: 'app/shared/lightbox/register-user.html' },
    ];

    $scope.$on('$routeChangeStart', function(scope, next, current) {

      var isLoginPage = window.location.href.indexOf("login") != -1;
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

    /*$scope.roles = userService.getRoles().then(
      function(result){
        $scope.roles = result;
      });*/

    $scope.showLightbox = function(template){
      $scope.overlay = $scope.overlays.filter(function(el){
        if(el.name == template) return el;
      });
      openLightbox();
    }

    $scope.closeLightbox = function(){
      closeLightbox();
    }


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