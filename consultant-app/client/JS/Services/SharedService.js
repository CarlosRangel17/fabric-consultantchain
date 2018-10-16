'use strict';

App.factory('SharedService', function ($http) {

    function isNullOrWhiteSpace(instance) {
        if (instance !== null && instance !== undefined && instance !== '' && $.trim(instance) !== '')
            return false;
        else
            return true;
    }

    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    function getTodayDate(){
        return new Date();
    }

    function getTodayShortDateString(){
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!

        var yyyy = today.getFullYear();
        if(dd<10){
            dd='0'+dd;
        } 
        if(mm<10){
            mm='0'+mm;
        } 
        var today = mm+'/'+dd+'/'+yyyy;
        return today;
    }

    function postData(urlAction, parameters, successFunctions, errorFunctions) {
        $http({
            method: "POST",
            url: urlAction,
            dataType: 'json',
            data: parameters,
            headers: { "Content-Type": "application/json" }
        }).then(function successCallback(response) {
            if (response.data.success) {
                SuccessHandling(successFunctions, response.data);
            } else {
                ErrorHandling(errorFunctions, response.data);
            }
        }, function errorCallback(response) {
            ErrorHandling(errorFunctions, response.data);
        });
    }

    function getData(urlAction, parameters, successFunctions, errorFunctions) {
        $http({
            method: "GET",
            url: urlAction,
            dataType: 'json',
            params: parameters,
            headers: { "Content-Type": "application/json" }
        }).then(function successCallback(response) {
            console.log('started from the bottom');
            console.log(response);
            if (response.data.success) {
                SuccessHandling(successFunctions, response.data);
            } else {
                ErrorHandling(errorFunctions, response.data);
            }
        }, function errorCallback(response) {
            ErrorHandling(errorFunctions, response.data);
        });
    }

    function SuccessHandling(successFunctions, data) {
        // Run any necessary functions
        angular.forEach(successFunctions, function (model, key) {
            if (!isNullOrWhiteSpace(model.parameter)) {
                model.runFunction(model.parameter);
            } else {
                model.runFunction(data);
            }
        })
    }

    function ErrorHandling(errorFunctions, data) {
        // Run any necessary functions
        angular.forEach(errorFunctions, function (model, key) {
            if (!isNullOrWhiteSpace(model.parameter)) {
                model.runFunction(model.parameter);
            } else {
                model.runFunction(data);
            }
        });
    }

    function toSuccessFunctionModel(successFunction) {
        return [{ runFunction: successFunction, parameter: null }];
    }

    function toErrorFunctionModel(errorFunction) {
        return [{ runFunction: errorFunction, parameter: null }];
    }

    return {
        IsNullOrWhiteSpace: isNullOrWhiteSpace,
        PostData: postData,
        GetData: getData,
        GetTodayDate: getTodayDate,
        GetTodayShortDateString: getTodayShortDateString,
        GetParameterByName: getParameterByName,
        ToErrorFunctionModel: toErrorFunctionModel,
        ToSuccessFunctionModel: toSuccessFunctionModel
    }
});