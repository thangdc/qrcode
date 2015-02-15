vietsoftApp.controller('MainCtrl', function ($scope, $location, $timeout, authService) {

    $scope.isBlack = false;
    $scope.$on('$routeChangeStart', function (next, current) {
        switch ($location.path()) {
            case '/login':
            case '/register':
            case '/forgetPassword':
            case '/changePassword':
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

    $scope.logoff = function () {
        authService.logout();
    }
});