'use strict'

App.directive('appPartial', function(){
    return {
        restrict: 'E',
        transclude: true,
        scope: 'isolate',
        locals: { service: 'bind'},
        templateUrl: function(elem, attr){
            return '/Views/' + attr.folder + '/' + attr.file + '.html';
        }
    }
});