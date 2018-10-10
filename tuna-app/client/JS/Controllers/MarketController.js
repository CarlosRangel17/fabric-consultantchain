'use strict'

var MarketController = function ($scope, $routeParams, MarketService) {

    // AngularJS - Init
    $scope.init = function () {
        
        $scope.ClientId = $routeParams.ClientId;
        MarketService.Init($scope);
    };

    // Public Method(s)
    $scope.CancelRequest = function(){
        
        clearRequestForm();
        $('#requestConsultant').modal('hide');
    }
    
    $scope.IsClient = function(){
        return !MarketService.IsNullOrWhiteSpace($scope.ClientId);
    }

    $scope.StartRequest = function(consultantId){
        
        // For consultant detail: 
        // var consultant = $filter('filter')($scope.Consultants, {'id': consultantId}); TODO: inject $filter
        $scope.Request.ConsultantId = consultantId;

        // Launch Modal to 
        $('#requestConsultant').modal('show');
    }

    $scope.SubmitRequest = function() {

        if (MarketService.IsNullOrWhiteSpace($scope.ClientId)) {
            console.log('Operation reserved only for authorized clients.');
        } else {
            MarketService.RequestConsultant($scope.Request);
        }
    }

    // Private Method(s)
    function clearRequestForm() {
        $scope.Request.ConsultantId = '';
        $scope.Request.StartDate = '';
        $scope.Request.EndDate = '';
        $scope.Request.Description = '';
        $scope.Request.Requirement1 = '';
    }
}

// The $inject property of every controller (and pretty much every other type of object in Angular) 
// needs to be a string array equal to the controllers arguments, only as strings
MarketController.$inject = ['$scope', '$routeParams', 'MarketService'];