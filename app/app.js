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
            controller: 'LoginCtrl'
        })
        .when('/register', {
            templateUrl: '/app/home/partials/register.html',
            controller: 'RegisterCtrl'
        })
        .when('/forgetPassword', {
            templateUrl: '/app/home/partials/forgetPassword.html',
            controller: 'ForgetPasswordCtrl'
        })
        .when('/changePassword', {
            templateUrl: '/app/home/partials/changePassword.html',
            controller: 'ChangePasswordCtrl'
        })
		.when('/emailMarketing', {
            templateUrl: '/app/emailMarketing/partials/emailMarketing.html',
            controller: 'EmailMarketingCtrl'
        })
        .when('/qrCodeBHYT', {
            templateUrl: '/app/qrcode/partials/qrCodeBHYT.html',
            controller: 'QRCodeBHYTCtrl'
        })
		.when('/ocr', {
            templateUrl: '/app/ocr/partials/imageToText.html',
            controller: 'ImageToTextCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });

}]);

var serviceBase = 'http://service.thangdc.com';
//var serviceBase = 'http://localhost:5782';
vietsoftApp.constant('ngAuthSettings', {
    apiServiceBaseUri: serviceBase,
    clientId: 'qrcode.thangdc.com'
});


vietsoftApp.config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptorService');
});

vietsoftApp.run(['authService', function (authService) {
    authService.fillAuthData();
}]);
