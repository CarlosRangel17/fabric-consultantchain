'use strict';

App.factory('MarketService', function ($http, SharedService) {

    // Set Global Var(s)
    var $appScope = null;

    var consultants = [
        {
            DateCreated: '2017-04-24',
            FirstName: 'Carlos',
            LastName: 'Rangel',
            Rating: 'Advanced',
            ConsultantType: 'Blockchain',
            AvatarUrl: 'carlos.jpg',
            ConsultantLevel: '3'
        },
        {
            DateCreated: '2017-05-07',
            FirstName: 'Keyurkumar',
            LastName: 'Patel',
            Rating: 'Advanced',
            ConsultantType: 'BI',
            AvatarUrl: 'keyur.jpeg',
            ConsultantLevel: '3'
        },
        {
            DateCreated: '2017-05-07',
            FirstName: 'Puneet',
            LastName: 'Mittal',
            Rating: 'Advanced',
            ConsultantType: 'Cloud',
            AvatarUrl: 'puneet.jpg',
            ConsultantLevel: '3'
        },
        {
            DateCreated: '2015-09-24',
            FirstName: 'Aval',
            LastName: 'Pandya',
            Rating: 'Expert',
            ConsultantType: 'BA',
            AvatarUrl: 'aval.jpeg',
            ConsultantLevel: '4'
        },
        {
            DateCreated: '2015-01-20',
            FirstName: 'Hines',
            LastName: 'Vaughan',
            Rating: 'Expert',
            ConsultantType: 'Mobile',
            AvatarUrl: 'hines.jpeg',
            ConsultantLevel: '3'
        },
        {
            DateCreated: '2018-06-24',
            FirstName: 'Brandon',
            LastName: 'Timmons',
            Rating: 'Intermediate',
            ConsultantType: 'Web',
            AvatarUrl: 'timmons.jpeg',
            ConsultantLevel: '2'
        },
        {
            DateCreated: '2017-03-24',
            FirstName: 'Peter',
            LastName: 'Menh',
            Rating: 'Advanced',
            ConsultantType: 'Web',
            AvatarUrl: 'peter.jpeg',
            ConsultantLevel: '3'
        },
        {
            DateCreated: '2014-06-01',
            FirstName: 'Mark',
            LastName: 'Salinas',
            Rating: 'Expert',
            ConsultantType: 'Cloud',
            AvatarUrl: 'mark.jpeg',
            ConsultantLevel: '4'
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

        SharedService.PostData('/Market/RequestConsultant', { sow: sow }, SharedService.ToSuccessFunctionModel(success), failFunctions);
    }

    return {
        Init: init,
        IsNullOrWhiteSpace: SharedService.IsNullOrWhiteSpace,
        RequestConsultant: requestConsultant
    }
});