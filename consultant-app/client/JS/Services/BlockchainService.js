'use strict';

App.factory('BlockchainService', function ($http, SharedService) {

    function isNullOrWhiteSpace(instance) {
        if (instance !== null && instance !== undefined && instance !== '' && $.trim(instance) !== '')
            return false;
        else
            return true;
    }

    function postData(urlAction, parameters, successFunctions, errorFunctions) {
        
        //TODO: Need to evaluate how to make POST methods over Nodejs (?)
        $http({
            method: "POST",
            url: urlAction,
            dataType: 'json',
            data: parameters,
            headers: { "Content-Type": "application/json" }
        }).then(function successCallback(response) {
            if (response.status === 200) {
                SuccessHandling(successFunctions, response.data);
            } else {
                ErrorHandling(errorFunctions, response.data);
            }
        }, function errorCallback(response) {
            ErrorHandling(errorFunctions, response.data);
        });
    }

    function getData(urlAction, parameters, successFunctions, errorFunctions) {
        
        // var url = urlAction + (SharedService.IsNullOrWhiteSpace(parameters) ? '' : '"' + parameters + '"');
        // console.log(url);

        $http({
            method: "GET",
            url: urlAction,
            dataType: 'json',
            params: parameters,
            headers: { "Content-Type": "application/json" }
        }).then(function successCallback(response) {
            if (response.status === 200) {
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

    function parameterize(record){
        
        var parameterizedRecord = '';
        Object.keys(record).forEach(function(key,index) {
            if (record.hasOwnProperty(key)){
                parameterizedRecord += (SharedService.IsNullOrWhiteSpace(record[key]) ? '' : record[key]) + '-';
            }
            else {
                parameterizedRecord += '-';
            }
        });

        // Remove '-' character
        parameterizedRecord = parameterizedRecord.slice(0, -1);

        return parameterizedRecord;
    }

    function parseData(blockchainJsonData) {

        var records = [];
        $.each(blockchainJsonData, function(key, block){
            block.Record.Id = key; // Assign object id
            records.push(block.Record);
        });

        return records;
    }

    return {
        Parameterize: parameterize,
        ParseData: parseData,
        IsNullOrWhiteSpace: isNullOrWhiteSpace,
        PostData: postData,
        GetData: getData,
    }
});