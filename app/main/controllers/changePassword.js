vietsoftApp.controller('ChangePasswordCtrl', function ($scope, $location, $timeout, authService) {

    $scope.loading = false;
    $scope.savedSuccessfully = false;
    $scope.errors = [];

    $scope.user = {
        OldPassword: '',
        NewPassword: '',
        ConfirmPassword: ''
    }

    if (!authService.authentication.isAuth)
        $location.path('/login');

    $scope.changePassword = function (user) {
        $scope.loading = true;

        authService.updatePassword(user).$promise.then(function (response) {

            $scope.user.OldPassword = '';
            $scope.user.NewPassword = '';
            $scope.user.ConfirmPassword = '';

            $scope.savedSuccessfully = true;
            $scope.message = 'Đổi mật khẩu thành công, bạn sẽ được chuyển đến trang chủ trong 3 giây';
            $scope.startTimer();
            $scope.loading = false;

        },
        function (response) {
            $scope.errors = [];
            for (var key in response.data.modelState) {
                for (var i = 0; i < response.data.modelState[key].length; i++) {
                    $scope.errors.push(response.data.modelState[key][i]);
                }
            }
            $scope.loading = false;
            $scope.savedSuccessfully = false;
        });
    }

    $scope.startTimer = function () {
        var timer = $timeout(function () {
            $timeout.cancel(timer);
            $location.path('/');
            $scope.savedSuccessfully = false;
        }, 3000);
    }

});
