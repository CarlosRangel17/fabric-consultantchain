'use strict';

App.factory('MarketService', function ($http, SharedService) {

    // Set Global Var(s)
    var $appScope = null;

    var consultants = [
        {
            DateCreated: '4/24/2017',
            FirstName: 'Carlos',
            LastName: 'Rangel',
            Rating: 'Advanced',
            ConsultantType: 'Blockchain Developer',
        },
        {
            DateCreated: '5/7/2017',
            FirstName: 'Keyurkumar',
            LastName: 'Patel',
            Rating: 'Advanced',
            ConsultantType: 'Business Intelligence (BI) Developer',
        },
        {
            DateCreated: '5/7/2017',
            FirstName: 'Puneet',
            LastName: 'Mittal',
            Rating: 'Advanced',
            ConsultantType: 'Cloud Developer',
        },
        {
            DateCreated: '9/24/2015',
            FirstName: 'Aval',
            LastName: 'Pandya',
            Rating: 'Expert',
            ConsultantType: 'Business Analyst (BA) Developer'
        },
        {
            DateCreated: '1/20/2015',
            FirstName: 'Hines',
            LastName: 'Vaughan',
            Rating: 'Expert',
            ConsultantType: 'Mobile Developer',
        },
        {
            DateCreated: '3/24/2017',
            FirstName: 'Trevor',
            LastName: 'Ferguson',
            Rating: 'Advanced',
            ConsultantType: 'Web Developer',
        },
        {
            DateCreated: '3/24/2017',
            FirstName: 'Peter',
            LastName: 'Menh',
            Rating: 'Advanced',
            ConsultantType: 'Web Developer',
        }
    ];

    // Success Var(s)
    var success = function (data) {
        // Properties
        $appScope.Consultants = data.market.Consultants; // Market Listings 

        // Return Status / Messages 
        $appScope.Success = data.success;
        $appScope.Message = data.message;

        // jQuery Functions
       
    };

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
        // $http.get('/Market/GetAllConsultants/').success(success);
        // SharedService.GetData('/get_all_tuna', null, SharedService.ToSuccessFunctionModel(success), failFunctions);
        $scope.Consultants = consultants;

        $(document).ready(function() { 
            $('.responsive').slick({
                infinite: false,
                slidesToShow: 3,
                slidesToScroll: 3
              });
        });
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