'use strict';

App.factory('MarketService', function ($http, SharedService) {

    // Set Global Var(s)
    var $appScope = null;

    // Success Var(s)
    var success = function (data) {

        // Properties
        $appScope.Consultants = data.market.Consultants; // Market Listings 

        // Return Status / Messages 
        $appScope.Success = data.success;
        $appScope.Message = data.message;

        // jQuery Functions
        // $(document).ready(function(){ });
    };

    // Default Fail Var(s)
    var failFunctions = SharedService.ToErrorFunctionModel(function (data) {
        $appScope.Error = data.message;
        // [Alert Box logic goes here]
    });

    // Constructor(s)
    function init($scope) {
        $appScope = $scope;

        // Load Market Data
        // TODO: Only show Consultant's that aren't reserved 
        // $http.get('/Market/GetAllConsultants/').success(success);
        SharedService.GetData('/Market/GetAllConsultants', null, SharedService.ToSuccessFunctionModel(success), failFunctions);
    }

    // Method(s)
    function requestConsultant(request){

            // Initialize an SOW object
            var sow = {
                ClientId: $appScope.ClientId,
                ConsultantId: $request.ConsultantId,
                Description: request.Description,
                TermStartDate: request.StartDate,
                TermEndDate: request.EndDate,
                RequireFullTime: true,
                Status: 0, // Requested,
                Requirement1: request.Requirement1
            };

        SharedService.PostData('/Market/RequestConsultant', { sow: sow }, SharedService.ToSuccessFunctionModel(success), failFunctions);
    }

    return {
        Init: init,
        IsNullOrWhiteSpace: SharedService.IsNullOrWhiteSpace,
        RequestConsultant: requestConsultant
    }
});