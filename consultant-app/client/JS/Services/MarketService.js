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
        // $appScope.Consultants =  BlockchainService.ParseData(data);  

        // Retrieve SOW Tracking # 
        // var sowBlock = BlockchainService.ParseData(data); 
        // $appScope.TrackingNumber = sowBlock.Id; // Sow Id  
        // $appScope.RequestName = sowBlock.Name; 

        // Return Status / Messages 
        // [Alert box logic]
        // $appScope.Success = data.success;
        // $appScope.Message = data.message;

        // jQuery Functions
        $('#requestConsultantModal').modal('hide');
        
        setTimeout(function(){
            $('#requestSuccessModal').modal('show'); // set timer to close 
        }, 1000);
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
    function requestConsultant(request, consultant){

        var todayShortDate = SharedService.GetTodayShortDateString();
        var today = SharedService.GetTodayDate();
        console.log(today)
        // Initialize an SOW object
        var sow = {
            Id: ((today.getTime() * 10000) + 621355968000000000),
            DateCreated: todayShortDate,
            TermStartDate: request.StartDate,
            TermEndDate: request.EndDate,
            RequireFullTime: !SharedService.IsNullOrWhiteSpace(request.RequireFullTime) && request.RequireFullTime, // true,
            RatePerHour: consultant.RatePerHour,
            Status: '0', // SOWStatuus<Enum>: Requested,
            ClientId: request.ClientId,
            Name: consultant.FirstName + ' ' + consultant.LastName,
            ConsultantId: consultant.Id,
            SOWId: '',
            Description: request.Description,
            Requirement1: request.Requirement1,
            Requirement2: request.Requirement2,
            Requirement3: request.Requirement3
        };

        console.log(record)
        // var sow = BlockchainService.Parameterize(record);
        BlockchainService.GetData('/request_consultant', { sow: sow }, SharedService.ToSuccessFunctionModel(requestSuccess), failFunctions);
    }

    return {
        Init: init,
        IsNullOrWhiteSpace: SharedService.IsNullOrWhiteSpace,
        RequestConsultant: requestConsultant
    }
});