angular.module('idtApp').directive('hasPermission', function(permissions) {  
  return {
    link: function(scope, element, attrs) {
      var value = attrs.hasPermission.trim();
      //console.log("test : " + value);
      var notPermissionFlag = value[0] === '!';
      if(notPermissionFlag) {
        value = value.slice(1).trim();
      }

      function toggleVisibilityBasedOnPermission() {
        var hasPermission = permissions.hasPermission(value);             if(hasPermission && !notPermissionFlag || !hasPermission && notPermissionFlag) {
          element.show();
        }
        else {
          element.hide();
        }
      }

      toggleVisibilityBasedOnPermission();
      scope.$on('permissionsChanged', toggleVisibilityBasedOnPermission);
    }
  };
});