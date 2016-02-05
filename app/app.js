var idtApp = angular.module('idtApp', ['ngRoute', 'ngCookies', 'ngResource', 'ngFileUpload', 'cgNotify', 'angularUtils.directives.dirPagination' , 'isteven-multi-select', "checklist-model"]),permissionList;

//var root = "http://146.175.138.153/tomcat/idt-backend";
var root ="http://localhost:8082";

idtApp.config(function($routeProvider, $httpProvider) {
  
  
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
      { name: 'add-user', url: 'app/shared/lightbox/add-user.html' },
      { name: 'edit-user', url: 'app/shared/lightbox/edit-user.html' },
      { name: 'add-device', url: 'app/shared/lightbox/add-device.html' },
      { name: 'add-role', url: 'app/shared/lightbox/add-role.html' },
      { name: 'edit-device', url: 'app/shared/lightbox/edit-device.html' },
      { name: 'edit-role', url: 'app/shared/lightbox/edit-role.html' },
      { name: 'add-test', url: 'app/shared/lightbox/add-test.html' },
      { name: 'edit-test', url: 'app/shared/lightbox/edit-test.html' },
      { name: 'pause-test', url: 'app/shared/lightbox/pause-test.html' },
      { name: 'stop-test', url: 'app/shared/lightbox/stop-test.html' },
      { name: 'show-report', url: 'app/shared/lightbox/show-report.html' },
    ];

    $scope.$on('$routeChangeStart', function(scope, next, current) {
      
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
      $rootScope.imageUuid = null;
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