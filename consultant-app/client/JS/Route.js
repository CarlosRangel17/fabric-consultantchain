var baseUri = 'Views/';

var configFunction = function ($routeProvider) {
    $routeProvider
        .when('/home', {
            templateUrl: baseUri + 'Home/home.html',
        })
        .when('/company', {
            templateUrl: baseUri + 'Company/company.html',
        })
        .when('/client', {
            templateUrl: baseUri + 'Client/client.html',
        })
        .when('/consultant', {
            templateUrl: baseUri + 'Consultant/consultant.html',
        })
        .when('/regulator', {
            templateUrl: baseUri + 'Regulator/regulator.html',
        })
        .when('/market', {
            templateUrl: baseUri + 'Market/market.html',
            controller: 'MarketController'
        })
        .when('/market/:ClientId', {
            templateUrl: baseUri + 'Market/market.html',
            controller: 'MarketController'
        })
        .otherwise({ redirectTo: '/home' });
}

configFunction.$inject = ['$routeProvider'];

App.config(configFunction);