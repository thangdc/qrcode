vietsoftApp.controller('LoginCtrl', function ($scope, $location, $timeout, authService) {

    $scope.loginMsg = '';
    $scope.loginLoading = false;

    $scope.user = {
        UserName: '',
        Password: '',
        RememberMe: false
    }

    $scope.login = function (user) {
        $scope.loginLoading = true;
        authService.login(user).then(function (response) {
            $location.path('/');
            $scope.loginLoading = false;
        },
         function (err) {
             $scope.loginMsg = err.error_description;
             $scope.loginLoading = false;
         });
    }
});