angular.module('idtApp').factory('permissions', function ($rootScope) {
    
    var state = false;
    return {
        setPermissions: function(permissions) {
          permissionList = permissions;
          $rootScope.$broadcast('permissionsChanged');
        },
        hasPermission: function (permission) {
          //console.log("test : " + permission);
          state = false;
          //console.log("permission" + " " + permission);
          //console.log("permissionlist : " + permissionList);
          //console.log(permissionList);
          if(permission != undefined && permissionList != undefined) {
            permission = permission.trim();
            //console.log(permissionList);
            permissionList.forEach( function (arrayItem) {	
              if(arrayItem.authority.trim() === permission){
	  			    state = true;
              //console.log(state); 
              //return arrayItem.authority.trim() == permission;
              }
            });
       	    if(state == true){
              return true;
       	    }
       	    else{
              return false;
            }
          }
   	      else{
            return false;
   	      }
        }
    };
});