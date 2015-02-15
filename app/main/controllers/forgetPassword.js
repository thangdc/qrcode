vietsoftApp.controller('ForgetPasswordCtrl', function ($scope, $location, $timeout, authService) {

    $scope.forgetPasswordSavedSuccessfully = false;
    $scope.forgetPasswordMessage = "";
    $scope.forgetPasswordErrors = [];
    $scope.forgetPasswordLoading = false;

    $scope.user = {
        Email: ''
    }

    $scope.resetPassword = function (user) {
        
        $scope.forgetPasswordErrors = [];
        $scope.forgetPasswordLoading = true;

        var changePass = authService.forgetPassword(user);
        changePass.$promise.then(function (data) {
            $scope.forgetPasswordSavedSuccessfully = true;
            $scope.forgetPasswordMessage = "Vui lòng kiểm tra email để nhận mật khẩu mới.";
            $scope.forgetPasswordLoading = false;
        }, function (response) {
            $scope.forgetPasswordErrors = [];
            for (var key in response.data.modelState) {
                for (var i = 0; i < response.data.modelState[key].length; i++) {
                    $scope.forgetPasswordErrors.push(response.data.modelState[key][i]);
                }
            }
            console.log($scope.forgetPasswordErrors);
            $scope.forgetPasswordLoading = false;
        });
    }
});