'use strict'

var MarketController = function ($scope, $filter, $routeParams, MarketService) {

    
    // AngularJS - Init
    $scope.init = function () {
        $scope.ClientId = $routeParams.ClientId;
        MarketService.Init($scope);
    };

    // Public Method(s)
    $scope.CancelRequest = function(){
        $('#requestConsultant').modal('hide');
    }
    
    $scope.IsClient = function(){
        return !MarketService.IsNullOrWhiteSpace($scope.ClientId);
    }

    $scope.MarketColor = function(){
        return $scope.IsClient() ? "app-yellow" : "app-blue";
    }

    $scope.StartRequest = function(consultantId){
        
        $scope.requestConsultant = {};

        var consultant = {};
        angular.forEach($scope.Consultants, function (model, key) {
            if (key === consultantId) {
                consultant = model;
            }
        });

        $scope.requestConsultant = consultant;
        $scope.requestConsultant.Discount = consultant.RatePerHour - 5;

        // Launch Modal.
        $('#requestConsultantModal').modal('show');
    }

    $scope.SubmitRequest = function() {

        console.log('submit request')
        if (MarketService.IsNullOrWhiteSpace($scope.ClientId)) {
            console.log('Operation reserved only for authorized clients.');
        } else {
            // MarketService.RequestConsultant($scope.requestConsultant);
        }
    }

    // Private Method(s)
}

// The $inject property of every controller (and pretty much every other type of object in Angular) 
// needs to be a string array equal to the controllers arguments, only as strings
MarketController.$inject = ['$scope', '$filter', '$routeParams', 'MarketService'];