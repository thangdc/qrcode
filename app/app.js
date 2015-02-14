var vietsoftApp = angular.module("vietsoftApp", ['ngRoute', 'ngResource', 'LocalStorageModule']);

vietsoftApp.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {

    $routeProvider.
        when('/', {
            templateUrl: '/app/home/partials/home.html',
            controller: 'HomeCtrl'
        })
        .when('/qrCode', {
            templateUrl: '/app/qrcode/partials/qrCode.html',
            controller: 'QRCodeCtrl'
        })
        .when('/login', {
            templateUrl: '/app/home/partials/login.html',
            controller: 'HomeCtrl'
        })
        .when('/register', {
            templateUrl: '/app/home/partials/register.html',
            controller: 'HomeCtrl'
        })
        .when('/forgetPassword', {
            templateUrl: '/app/home/partials/forgetPassword.html',
            controller: 'HomeCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });

}]);

var serviceBase = 'http://localhost:50360';
vietsoftApp.constant('ngAuthSettings', {
    apiServiceBaseUri: serviceBase
});

vietsoftApp.config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptorService');
});

vietsoftApp.run(['authService', function (authService) {
    authService.fillAuthData();
}]);