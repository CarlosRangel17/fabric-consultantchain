'use strict';

App.factory('CompanyService', function ($http, BlockchainService, SharedService) {

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
        BlockchainService.GetData('/get_all_consultants', null, SharedService.ToSuccessFunctionModel(success), failFunctions);
    }

    // Method(s)
    function submitConsultant(newConsultant, clientId){

        var todayShortDate = SharedService.GetTodayShortDateString();
        var today = SharedService.GetTodayDate();
        var id = ((today.getTime() * 10000) + 621355968000000000);
        // Initialize a Consultant object
        var consultant = {
            Id: id.toString(),
            DateCreated: todayShortDate,
            FirstName: newConsultant.FirstName,
            LastName: newConsultant.LastName,
            AvatarImage: newConsultant.FirstName.toLowerCase() + '.jpeg',
            Title: newConsultant.Title,
            RatePerHour: newConsultant.RatePerHour,
            SkillType: newConsultant.SkillType,
            SkillLevel: newConsultant.SkillLevel,
            Skill1: newConsultant.Skill1,
            Skill2: newConsultant.Skill2,
            Skill3: newConsultant.Skill3,
            ClientId: clientId.toString()
        };

        // var consultant =  BlockchainService.Parameterize(record);

        // console.log(consultant);
        BlockchainService.GetData('/add_consultant', {consultant: consultant}, SharedService.ToSuccessFunctionModel(success), failFunctions);
    }

    return {
        Init: init,
        IsNullOrWhiteSpace: SharedService.IsNullOrWhiteSpace,
        SubmitConsultant: submitConsultant
    }
});