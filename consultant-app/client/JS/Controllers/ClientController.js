'use strict'

var ClientController = function ($scope, ClientService) {
    
    $scope.init = function () {
        ClientService.Init($scope);
    };
}

// The $inject property of every controller (and pretty much every other type of object in Angular) 
// needs to be a string array equal to the controllers arguments, only as strings
ClientController.$inject = ['$scope', 'ClientService'];