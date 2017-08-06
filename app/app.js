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
	//$locationProvider.html5Mode(true);
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
