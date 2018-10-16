'use strict'

App.directive('modal', function(){
    return {
        restrict: 'E',
        transclude: true,
        scope: 'isolate',
        locals: { service: 'bind'},
        templateUrl: function(elem, attr){
            return '/Views/Shared/Modals/' + attr.name + '.html';
        }
    }
});