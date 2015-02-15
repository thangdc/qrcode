vietsoftApp.controller('EmailMarketingCtrl', function ($scope, $http, $resource, emailMarketingServices) {
    
    $scope.emailMarketing = {
        Url: '',
        Content: '',
        Results: ''
    };

    $scope.isQuery = false;

    $scope.crawlEmail = function (item) {
        $scope.isQuery = true;
        emailMarketingServices.crawlEmail(item).$promise.then(function (response) {
            $scope.isQuery = false;
            $scope.emailMarketing.Results = response.results.split(',');
        }, function (error) {
            $scope.isQuery = false;
        });
    }

});