'use strict';

App.factory('MarketService', function ($http, BlockchainService, SharedService) {

    // Set Global Var(s)
    var $appScope = null;

    var success = function (data) {
        
        // Market Listings
        $appScope.Consultants =  BlockchainService.ParseData(data);  

        // Return Status / Messages 
        $appScope.Success = data.success;
        $appScope.Message = data.message;

        // jQuery Functions
    };

    var requestSuccess = function (data){

        // (Maybe) Market Listings
        $appScope.Consultants =  BlockchainService.ParseData(data);  

        // Return Status / Messages 
        // [Alert box logic]
        $appScope.Success = data.success;
        $appScope.Message = data.message;

        // jQuery Functions
    }

    // Default Fail Var(s)
    var failFunctions = SharedService.ToErrorFunctionModel(function (data) {
        $appScope.Error = data.message;
        console.log(data);
        // [Alert Box logic goes here]
    });

    // Constructor(s)
    function init($scope) {
        $appScope = $scope;

        // Load Market Data
        // TODO: Only show Consultant's that aren't reserved 
        BlockchainService.GetData('/get_all_consultants', null, SharedService.ToSuccessFunctionModel(success), failFunctions);

        setTimeout(function(){
            $(document).ready(function() { 
                $('.responsive').slick({
                    infinite: false,
                    slidesToShow: 3,
                    slidesToScroll: 3
                  });
            });
        }, 1000);
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

        BlockchainService.PostData('/request_consultant', { sow: sow }, SharedService.ToSuccessFunctionModel(requestSuccess), failFunctions);
    }

    return {
        Init: init,
        IsNullOrWhiteSpace: SharedService.IsNullOrWhiteSpace,
        RequestConsultant: requestConsultant
    }
});