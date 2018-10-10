'use strict'

var ConsultantController = function ($scope, $filter, ConsultantService) {
    
    // AngularJS - Init
    $scope.init = function () {
        ConsultantService.Init($scope);
    };

    // Public Method(s)
    
    // Private Method(s)
}

// The $inject property of every controller (and pretty much every other type of object in Angular) 
// needs to be a string array equal to the controllers arguments, only as strings
ConsultantController.$inject = ['$scope', '$filter', 'ConsultantService'];