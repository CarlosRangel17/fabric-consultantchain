'use strict';

App.factory('CompanyService', function ($http, BlockchainService, SharedService) {

    // Set Global Var(s)
    var $appScope = null;

    var queryAllConsultantSuccess = function (data) {
        
        console.log('Success callback for queryAllConsultant !');

        // Biz Logic
        $appScope.Consultants =  BlockchainService.ParseData(data);  

        // Return Status / Messages 
        $appScope.Success = data.success;
        $appScope.Message = data.message;

        console.log('$appScope: ', $appScope);

        // jQuery Functions
    };

    var queryAllSOWSuccess = function(data){

        console.log('Success callback for queryAllSOW!');

        // Biz Logic
        $appScope.SOWList =  BlockchainService.ParseData(data);  

        // Return Status / Messages 
        $appScope.Success = data.success;
        $appScope.Message = data.message;

        console.log('$appScope: ', $appScope);

        // jQuery Functions
    };
    
    var reloadConsultants = function() {

        // Show success modal
        $('#addConsultantModal').modal('hide');       
        setTimeout(function(){
            $('#addConsultantSuccessModal').modal('show');  // set timer to show 
        }, 3000);  
        

        setTimeout(function(){
            console.log('run query all consultants')
            BlockchainService.GetData('/get_all_consultants', null, SharedService.ToSuccessFunctionModel(queryAllConsultantSuccess), failFunctions);
        }, 8000);  
    };

    // Default Fail Var(s)
    var failFunctions = SharedService.ToErrorFunctionModel(function (data) {
        console.log('Error:', data);
        // [Alert Box logic goes here]
    });

    // Constructor(s)
    function init($scope) {
        // Set Global App Scope
        $appScope = $scope;

        // Load Market Data
        BlockchainService.GetData('/get_all_consultants', null, SharedService.ToSuccessFunctionModel(queryAllConsultantSuccess), failFunctions);
        // Load SOW Data
        BlockchainService.GetData('/get_all_sows', null, SharedService.ToSuccessFunctionModel(queryAllSOWSuccess), failFunctions);
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

        console.log(consultant);
        BlockchainService.GetData('/add_consultant', { consultant: consultant }, SharedService.ToSuccessFunctionModel(function(data){}), failFunctions);

        // Attempt to force reload of consultants 
        reloadConsultants();
    }

    return {
        Init: init,
        IsNullOrWhiteSpace: SharedService.IsNullOrWhiteSpace,
        SubmitConsultant: submitConsultant
    }
});