var vietsoftApp = angular.module("vietsoftApp", ['ngRoute', 'ngResource', 'LocalStorageModule']);

vietsoftApp.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {

    $routeProvider.
        when('/', {
            templateUrl: '/qrcode/app/qrcode/partials/qrCode.html',
            controller: 'QRCodeCtrl'
        })
		.when('/emailMarketing', {
            templateUrl: '/qrcode/app/emailMarketing/partials/emailMarketing.html',
            controller: 'EmailMarketingCtrl'
        })
        .when('/qrCodeBHYT', {
            templateUrl: '/qrcode/app/qrcode/partials/qrCodeBHYT.html',
            controller: 'QRCodeBHYTCtrl'
        })
		.when('/ocr', {
            templateUrl: '/qrcode/app/ocr/partials/imageToText.html',
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
	//clientId: 'test'
});


vietsoftApp.config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptorService');
});

vietsoftApp.run(['authService', function (authService) {
    authService.fillAuthData();
}]);
