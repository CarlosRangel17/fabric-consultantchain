var baseUri = 'Views/';

var configFunction = function ($routeProvider) {
    $routeProvider
        .when('/home', {
            templateUrl: 'Views/Home/home.html',
        })
        .when('/market/:ClientId', {
            templateUrl: baseUri + 'Market/market.html',
            controller: 'MarketController'
        })
        .otherwise({ redirectTo: '/home' });
}

configFunction.$inject = ['$routeProvider'];

App.config(configFunction);