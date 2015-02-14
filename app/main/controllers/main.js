vietsoftApp.controller('MainCtrl', function ($scope, $location, $timeout, authService) {

    $scope.isBlack = false;
    $scope.$on('$routeChangeStart', function (next, current) {
        switch ($location.path()) {
            case '/login':
            case '/register':
            case '/forgetPassword':
                $scope.isBlack = true;
                break;
            default:
                $scope.isBlack = false;
                break;
        }
    });

    $scope.authentication = authService.authentication;

    $scope.toggleCanvas = function () {
        if ($(window).width() <= 992) {
            $('.row-offcanvas').toggleClass('active');
            $('.left-side').removeClass("collapse-left");
            $(".right-side").removeClass("strech");
            $('.row-offcanvas').toggleClass("relative");
        } else {
            $('.left-side').toggleClass("collapse-left");
            $(".right-side").toggleClass("strech");
        }
    }

    $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    };

    $scope.user = {
        UserName: '',
        Password: '',
        RememberMe: false
    }

    $scope.loginMsg = '';

    function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    $scope.login = function (user) {
        authService.login(user).then(function (response) {
            $scope.user.UserName = '';
            $scope.user.Password = '';
            $scope.user.RememberMe = false;
            $location.path('/');
        },
         function (err) {
             $scope.loginMsg = err.error_description;
         });
    }

    $scope.logoff = function () {
        authService.logout();
    }

    $scope.savedSuccessfully = false;
    $scope.message = "";
    $scope.errors = [];
    $scope.register = function (user) {

        var reg = authService.register(user);
        reg.$promise.then(function (data) {
            $scope.savedSuccessfully = true;
            $scope.message = "Bạn đã đăng ký thành công, bạn sẽ được chuyển đến trang đăng nhập trong 2 giây.";

            user.UserName = '';
            user.Email = '';
            user.Password = '';
            user.Confirm = '';
            $scope.startTimer();
            $scope.errors = [];
        }, function (response) {
            $scope.errors = [];
            for (var key in response.data.modelState) {
                for (var i = 0; i < response.data.modelState[key].length; i++) {
                    $scope.errors.push(response.data.modelState[key][i]);
                }
            }
        });
    };

    $scope.startTimer = function () {
        var timer = $timeout(function () {
            $timeout.cancel(timer);
            $location.path('/login');
            $scope.message = '';
        }, 3000);
    }

});