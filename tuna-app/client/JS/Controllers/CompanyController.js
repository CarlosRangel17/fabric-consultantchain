'use strict'

var CompanyController = function ($scope, $filter, CompanyService) {
    
    // AngularJS - Init
    $scope.init = function () {
        CompanyService.Init($scope);
    };

    // Public Method(s)
    
    // Private Method(s)
}

// The $inject property of every controller (and pretty much every other type of object in Angular) 
// needs to be a string array equal to the controllers arguments, only as strings
CompanyController.$inject = ['$scope', '$filter', 'CompanyService'];