vietsoftApp.controller('MainCtrl', function ($scope, $location, $timeout, authService) {

    $scope.authentication = authService.authentication;

	$scope.loginMsg = '';
    $scope.loginLoading = false;
	$scope.registerLoading = false;
	$scope.message = "";
    $scope.errors = [];
	
	$scope.loading = false;
    $scope.changePasswordSuccessfully = false;
	$scope.savedSuccessfully = false;
	
    $scope.user = {
        UserName: '',
        Password: '',
        RememberMe: false
    }

    $scope.userRegister = {
        PhoneNumber: '',
        Email: '',
        Password: '',
        ConfirmPassword: ''
    }
	
	$scope.userInfo = {
        OldPassword: '',
        NewPassword: '',
        ConfirmPassword: ''
    }
	
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
	
	$scope.loginCancel = function(){
		$('#loginDialog').modal('toggle');
	}
	
	$scope.showLogin = function(){
		$scope.resetForm();
		$('#loginDialog').modal('toggle');
	}
	
	$scope.registerCancel = function(){
		$('#registerDialog').modal('toggle');
	}
	
	$scope.showRegister = function(){
		$scope.resetForm();
		$('#registerDialog').modal('toggle');
	}

    $scope.login = function () {
        $scope.loginLoading = true;
        authService.login($scope.user).then(function (response) {
            $scope.loginLoading = false;
			$('#loginDialog').modal('toggle');
			window.location.reload();
        },
         function (err) {
             $scope.loginMsg = err.error_description;
             $scope.loginLoading = false;
         });
    }
	
    $scope.register = function () {
        $scope.errors = [];
        $scope.registerLoading = true;

        authService.register($scope.userRegister).$promise.then(function (data) {
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
			$('#registerDialog').modal('toggle');
			$('#loginDialog').modal('toggle');
        }, 3000);
    }
	
	$scope.showChangePassword = function(){
		$scope.resetForm();
		$('#changePasswordDialog').modal('toggle');
	}
	
	$scope.changePasswordCancel = function(){
		$('#changePasswordDialog').modal('toggle');
	}

    $scope.changePassword = function () {
        $scope.loading = true;

        authService.updatePassword($scope.userInfo).$promise.then(function (response) {
            $scope.changePasswordSuccessfully = true;
            $scope.message = 'Đổi mật khẩu thành công.';
            $scope.startChangePasswordTimer();
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
            $scope.changePasswordSuccessfully = false;
        });
    }

    $scope.startChangePasswordTimer = function () {
        var timer = $timeout(function () {
            $timeout.cancel(timer);
            $('#changePasswordDialog').modal('toggle');
            $scope.changePasswordSuccessfully = false;
        }, 1000);
    }
	
	$scope.resetForm = function(){
		$scope.loginMsg = '';
		$scope.loginLoading = false;
		$scope.registerLoading = false;
		$scope.message = "";
		$scope.errors = [];
		
		$scope.loading = false;
		$scope.changePasswordSuccessfully = false;
		$scope.savedSuccessfully = false;
		
		$scope.user = {
			UserName: '',
			Password: '',
			RememberMe: false
		}

		$scope.userRegister = {
			PhoneNumber: '',
			Email: '',
			Password: '',
			ConfirmPassword: ''
		}
		
		$scope.userInfo = {
			OldPassword: '',
			NewPassword: '',
			ConfirmPassword: ''
		}
	}
	
	if (!authService.authentication.isAuth)
        $location.path('/login');
});