var idtApp = angular.module('idtApp', ['ngRoute', 'ngCookies', 'ngResource', 'ngFileUpload', 'cgNotify', 'angularUtils.directives.dirPagination' , 'isteven-multi-select', "checklist-model"]),permissionList;

//var root = "http://146.175.138.153/tomcat/idt-backend";
var root ="http://localhost:8082";

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
       permission   : 'LOGON',
   })
	.when('/dashboard', {
       templateUrl  : 'app/pages/dashboard/dashboard-view.html',
       controller   : 'dashboardController',
       permission   : 'LOGON',
   })
    .when('/users', {
    	templateUrl : 'app/pages/users/users-view.html',
      permission: 'USER_ADMIN',
    })
    .when('/devices', {
    	templateUrl : 'app/pages/devices/devices-view.html',
    	controller  : 'deviceController',
    })
    .when('/tests', {
    	templateUrl : 'app/pages/tests/tests-view.html',
    	controller  : 'testController',
    })
    .when('/tests/:testId', {
      templateUrl : 'app/pages/tests/start-test-view.html',
      controller  : 'testDetailController',
    })
    .when('/tests/:testId/fitts', {
      templateUrl : 'app/pages/tests/fitts-test-view.html',
      controller  : 'testStartController',
    })
    .when('/reports', {
    	templateUrl : 'app/pages/reports/reports-view.html',
    	controller  : 'reportController',
    })
    .when('/unauthorized', {
      templateUrl: 'app/pages/unauthorized/error-view.html',
      controller: 'unauthorizedController', 
    })
    .when('/logout', {
    })
    .when('/account', {
    	templateUrl : 'app/pages/account/account-view.html',
    	controller  : 'accountController',
    });

}).directive('imageonload', function () {
    return {
        restrict: 'A',

        // Bind the DOM events to the scope
        link: function (scope, element, attrs) {

            // Check when change scope occurs
            scope.$watch('device', function () {
                if (scope.device) {
                    //console.log("New image url : " + scope.device.inputDeviceImage.path);
                }
            });

            // When new image is loaded
            element.bind('load', function () {
                //console.log("New image url is loaded ! " + scope.device.inputDeviceImage.path);
            });
        }
    };
}).run(run);

run.$inject = ['$rootScope', '$location', '$cookieStore', '$http'];

function run($rootScope, $location, $cookieStore, $http , permissions) {
    // keep user logged in after page refresh
    $rootScope.globals = $cookieStore.get('globals') || {};
    if ($rootScope.globals.currentUser) {
      //console.log("rootscope : " + $rootScope.globals.currentUser.authdata);
        $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
      }
    }

idtApp.controller('mainController', function($rootScope, $cookies, $locale, $scope, $location, permissions, $http, userService, notify, translationService, testService) {
 
    notify.config({
      position: 'right',
      maximumOpen: 3
    }); 

    $scope.year = new Date().getFullYear();
	$scope.localeId = window.navigator.userLanguage || window.navigator.language; // language and region		
	translationService.getTranslation($scope, $scope.localeId.substring(0, 2));		
	console.log($scope.localeId.substring(0, 2));
	
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
      var loggedIn = $rootScope.globals.currentUser;

      if($location.path() == '/' && loggedIn == undefined)
      {
        $location.path('/login')
      }

      //console.log(next.$$route);
      //loadCurrentData();
      var permission = next.$$route.permission;
      //console.log(permission);
      //console.log(permission);
      //console.log(permissions.hasPermission(permission));
            //console.log("login : " + loggedIn);
            if(loggedIn != undefined)
            {
              loadCurrentData();
            } 
            if(loggedIn)
            {
              $rootScope.authenticated = true;
            }
            else
            {
              $location.path('/login');
              $rootScope.authenticated = false;
            }
            if((permission != undefined) && !permissions.hasPermission(permission)) {
              //console.log("not equal");
             $location.path('/login');
            }
            if(!loggedIn)
            {
              $location.path('/login');
            }
  });

    function applyRemoteData(newUsers){

    $rootScope.currentuser = newUsers;
    //console.log($rootScope.currentuser);
    permissionList = $rootScope.currentuser.authorities;
    //console.log(permissionList);
    //console.log("permissionlist : " + permissionList);
    //console.log(permissionList);
    permissions.setPermissions(permissionList);
  }

  function loadCurrentData() {
    userService.getcurrentUser().then(function(users){
      applyRemoteData(users);
    });
  }

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

    $scope.postTrial = function(testId, sequenceId, data){
      testService.postTrial(testId, sequenceId, data).then(function(){
        notify({
          "message" : 'Test trial saved successfully',
          'classes' : 'success'
        });
      });
    }
});

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

idtApp.service('translationService', function($resource) {  		
	this.getTranslation = function($scope, language) {		
		var languageFilePath = 'translations/translation_' + language + '.json';		
		$resource(languageFilePath).get(function (data) {		
			$scope.translation = data;		
		});		
	};		
});