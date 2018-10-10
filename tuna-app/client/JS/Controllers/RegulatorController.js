'use strict'

var RegulatorController = function ($scope, $filter, RegulatorService) {
    
    // AngularJS - Init
    $scope.init = function () {
        RegulatorService.Init($scope);
    };

    // Public Method(s)
    
    // Private Method(s)
}

// The $inject property of every controller (and pretty much every other type of object in Angular) 
// needs to be a string array equal to the controllers arguments, only as strings
RegulatorController.$inject = ['$scope', '$filter', 'RegulatorService'];