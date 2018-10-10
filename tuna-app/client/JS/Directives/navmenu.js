'use strict'

App.directive('navmenu', function(){
    return {
        restrict: 'E',
        transclude: true,
        scope: 'isolate',
        locals: { service: 'bind'},
        templateUrl: function(elem, attr){
            return '/Shared/navmenu.html';
        }
    }
});