vietsoftApp.controller('RegisterCtrl', function ($scope, $location, $timeout, authService) {

    $scope.savedSuccessfully = false;
    $scope.message = "";
    $scope.errors = [];
    $scope.registerLoading = false;

    $scope.user = {
        PhoneNumber: '',
        Email: '',
        Password: '',
        ConfirmPassword: ''
    }

    $scope.register = function (user) {
        $scope.errors = [];
        $scope.registerLoading = true;

        authService.register(user).$promise.then(function (data) {
            $scope.savedSuccessfully = true;
            $scope.message = "Bạn đã đăng ký thành công, bạn sẽ được chuyển đến trang đăng nhập trong 3 giây.";
            $scope.registerLoading = false;
            $scope.startTimer();
        }, function (response) {
            $scope.errors = [];
            for (var key in response.data.modelState) {
                for (var i = 0; i < response.data.modelState[key].length; i++) {
                    $scope.errors.push(response.data.modelState[key][i]);
                }
            }
            $scope.registerLoading = false;
        });
    };

    $scope.startTimer = function () {
        var timer = $timeout(function () {
            $timeout.cancel(timer);
            $location.path('/login');
        }, 3000);
    }

});
