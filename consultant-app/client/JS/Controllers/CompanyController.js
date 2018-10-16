'use strict'

var CompanyController = function ($scope, $filter, CompanyService) {
    
    var clientId = 1;

    // AngularJS - Init
    $scope.init = function () {
        CompanyService.Init($scope);
    };

    // Public Method(s)
    $scope.AddConsultant = function(){
        $scope.newConsultant = {};

        $('#addConsultantModal').modal('show');
    }

    $scope.SubmitNewConsultant = function(){

        if (!$scope.newConsultant || CompanyService.IsNullOrWhiteSpace($scope.newConsultant.FirstName)  
            || CompanyService.IsNullOrWhiteSpace($scope.newConsultant.LastName)  
            || CompanyService.IsNullOrWhiteSpace($scope.newConsultant.Title)  
            || CompanyService.IsNullOrWhiteSpace($scope.newConsultant.RatePerHour)  
            || CompanyService.IsNullOrWhiteSpace($scope.newConsultant.SkillType)  
            || CompanyService.IsNullOrWhiteSpace($scope.newConsultant.SkillLevel)  
            || CompanyService.IsNullOrWhiteSpace($scope.newConsultant.Skill1)){

            console.log("Please fill out all required fields.");
        }
        else {
            $scope.newConsultant.SkillLevel = getSkillLevelInt($scope.newConsultant.SkillLevel);
            console.log($scope.newConsultant);
            CompanyService.SubmitConsultant($scope.newConsultant, clientId);
        }
    }

    // Private Method(s)
    function getSkillLevelInt(level){
        switch(level){
            case "Beginner":
                return "1";
            case "Intermediate":
                return "2";
            case "Advanced":
                return "3";
            case "Expert":
                return "4";
            default:
                return "1";
        }
    }
}

// The $inject property of every controller (and pretty much every other type of object in Angular) 
// needs to be a string array equal to the controllers arguments, only as strings
CompanyController.$inject = ['$scope', '$filter', 'CompanyService'];