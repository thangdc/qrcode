vietsoftApp.controller('MainCtrl', ['$scope', '$location', '$timeout', 'authService', 'ngAuthSettings', '$http', 'qrCodeServices',
	function ($scope, $location, $timeout, authService, ngAuthSettings, $http, qrCodeServices) {

	    $scope.authentication = authService.authentication;

	    $scope.loginMsg = '';
	    $scope.loginLoading = false;
	    $scope.registerLoading = false;
	    $scope.message = "";
	    $scope.errors = [];

	    $scope.loading = false;
	    $scope.changePasswordSuccessfully = false;
	    $scope.savedSuccessfully = false;

	    $scope.qrCodeType = '';

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

	    $scope.loginCancel = function () {
	        $('#loginDialog').modal('toggle');
	    }

	    $scope.showLogin = function () {
	        $scope.resetForm();
	        $('#loginDialog').modal('toggle');
	    }

	    $scope.registerCancel = function () {
	        $('#registerDialog').modal('toggle');
	    }

	    $scope.showRegister = function () {
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

	    $scope.showChangePassword = function () {
	        $scope.resetForm();
	        $('#changePasswordDialog').modal('toggle');
	    }

	    $scope.changePasswordCancel = function () {
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

	    $scope.resetForm = function () {
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

	    $scope.exportQRCode = function (type) {
	        $scope.qrCodeType = type;
	        $('#exportDialog').modal('toggle');
	    }

	    $scope.importQRCode = function (type) {
	        $scope.qrCodeType = type;
	        $('#importDialog').modal('toggle');
	    }

	    $scope.exportToExcel = function () {
	        var url = '';
	        if ($scope.qrCodeType == 'Content') {
	            url = ngAuthSettings.apiServiceBaseUri + '/api/qrcontents/exportexcel';
	        }
	        else if ($scope.qrCodeType == 'SMS') {
	            url = ngAuthSettings.apiServiceBaseUri + '/api/qrsms/exportexcel';
	        }
	        else if ($scope.qrCodeType == 'Email') {
	            url = ngAuthSettings.apiServiceBaseUri + '/api/qremails/exportexcel';
	        }
	        else if ($scope.qrCodeType == 'Phone') {
	            url = ngAuthSettings.apiServiceBaseUri + '/api/qrphones/exportexcel';
	        }
	        else if ($scope.qrCodeType == 'Contact') {
	            url = ngAuthSettings.apiServiceBaseUri + '/api/qrcontacts/exportexcel';
	        }
	        else if ($scope.qrCodeType == 'Address') {
	            url = ngAuthSettings.apiServiceBaseUri + '/api/qraddresses/exportexcel';
	        }
	        else if ($scope.qrCodeType == 'Website') {
	            url = ngAuthSettings.apiServiceBaseUri + '/api/qrwebsites/exportexcel';
	        }
	        else if ($scope.qrCodeType == 'Wifi') {
	            url = ngAuthSettings.apiServiceBaseUri + '/api/qrwifis/exportexcel';
	        }
	        else if ($scope.qrCodeType == 'Product') {
	            url = ngAuthSettings.apiServiceBaseUri + '/api/qrproducts/exportexcel';
	        }
	        $scope.exportData(url);
	    }

	    $scope.exportToWord = function () {
	        var url = '';

	        if ($scope.qrCodeType == 'Content') {
	            url = ngAuthSettings.apiServiceBaseUri + '/api/qrcontents/exportword';
	        }
	        else if ($scope.qrCodeType == 'SMS') {
	            url = ngAuthSettings.apiServiceBaseUri + '/api/qrsms/exportword';
	        }
	        else if ($scope.qrCodeType == 'Email') {
	            url = ngAuthSettings.apiServiceBaseUri + '/api/qremails/exportword';
	        }
	        else if ($scope.qrCodeType == 'Phone') {
	            url = ngAuthSettings.apiServiceBaseUri + '/api/qrphones/exportword';
	        }
	        else if ($scope.qrCodeType == 'Contact') {
	            url = ngAuthSettings.apiServiceBaseUri + '/api/qrcontacts/exportword';
	        }
	        else if ($scope.qrCodeType == 'Address') {
	            url = ngAuthSettings.apiServiceBaseUri + '/api/qraddresses/exportword';
	        }
	        else if ($scope.qrCodeType == 'Website') {
	            url = ngAuthSettings.apiServiceBaseUri + '/api/qrwebsites/exportword';
	        }
	        else if ($scope.qrCodeType == 'Wifi') {
	            url = ngAuthSettings.apiServiceBaseUri + '/api/qrwifis/exportword';
	        }
	        else if ($scope.qrCodeType == 'Product') {
	            url = ngAuthSettings.apiServiceBaseUri + '/api/qrproducts/exportword';
	        }
	        $scope.exportData(url);
	    }

	    $scope.exportToQRCode = function () {
	        var url = '';

	        if ($scope.qrCodeType == 'Content') {
	            url = ngAuthSettings.apiServiceBaseUri + '/api/qrcontents/exportqrcode';
	        }
	        else if ($scope.qrCodeType == 'SMS') {
	            url = ngAuthSettings.apiServiceBaseUri + '/api/qrsms/exportqrcode';
	        }
	        else if ($scope.qrCodeType == 'Email') {
	            url = ngAuthSettings.apiServiceBaseUri + '/api/qremails/exportqrcode';
	        }
	        else if ($scope.qrCodeType == 'Phone') {
	            url = ngAuthSettings.apiServiceBaseUri + '/api/qrphones/exportqrcode';
	        }
	        else if ($scope.qrCodeType == 'Contact') {
	            url = ngAuthSettings.apiServiceBaseUri + '/api/qrcontacts/exportqrcode';
	        }
	        else if ($scope.qrCodeType == 'Address') {
	            url = ngAuthSettings.apiServiceBaseUri + '/api/qraddresses/exportqrcode';
	        }
	        else if ($scope.qrCodeType == 'Website') {
	            url = ngAuthSettings.apiServiceBaseUri + '/api/qrwebsites/exportqrcode';
	        }
	        else if ($scope.qrCodeType == 'Wifi') {
	            url = ngAuthSettings.apiServiceBaseUri + '/api/qrwifis/exportqrcode';
	        }
	        else if ($scope.qrCodeType == 'Product') {
	            url = ngAuthSettings.apiServiceBaseUri + '/api/qrproducts/exportqrcode';
	        }

	        $scope.exportData(url);
	    }

	    $scope.exportData = function (url) {
	        if (url != '') {
	            $http({ method: 'GET', url: url }).
			success(function (data, status, headers, config) {
			    $('#exportDialog').modal('toggle');
			    window.location.href = data;
			});
	        }
	    }

	    $scope.importQRCodeData = function () {

	        var url = '';

	        if ($scope.qrCodeType == 'Content') {
	            url = ngAuthSettings.apiServiceBaseUri + '/api/qrcontents/importqrcode';
	        }
	        else if ($scope.qrCodeType == 'SMS') {
	            url = ngAuthSettings.apiServiceBaseUri + '/api/qrsms/importqrcode';
	        }
	        else if ($scope.qrCodeType == 'Email') {
	            url = ngAuthSettings.apiServiceBaseUri + '/api/qremails/importqrcode';
	        }
	        else if ($scope.qrCodeType == 'Phone') {
	            url = ngAuthSettings.apiServiceBaseUri + '/api/qrphones/importqrcode';
	        }
	        else if ($scope.qrCodeType == 'Contact') {
	            url = ngAuthSettings.apiServiceBaseUri + '/api/qrcontacts/importqrcode';
	        }
	        else if ($scope.qrCodeType == 'Address') {
	            url = ngAuthSettings.apiServiceBaseUri + '/api/qraddresses/importqrcode';
	        }
	        else if ($scope.qrCodeType == 'Website') {
	            url = ngAuthSettings.apiServiceBaseUri + '/api/qrwebsites/importqrcode';
	        }
	        else if ($scope.qrCodeType == 'Wifi') {
	            url = ngAuthSettings.apiServiceBaseUri + '/api/qrwifis/importqrcode';
	        }
	        else if ($scope.qrCodeType == 'Product') {
	            url = ngAuthSettings.apiServiceBaseUri + '/api/qrproducts/importqrcode';
	        }

	        var fileUpload = $('#fileUpload').get(0);
	        var files = fileUpload.files;

	        if (files.length > 0) {

	            var fileName = files[0].name;
	            var ext = fileName.substr(fileName.length - 5);

	            if (ext == '.xlsx') {
	                var formdata = new FormData();
	                angular.forEach(files, function (value, key) {
	                    formdata.append(key, value);
	                });
	                $http({
	                    method: 'POST',
	                    url: url,
	                    data: formdata,
	                    headers: {
	                        'Content-Type': undefined
	                    }
	                }).success(function (data, status, headers, config) {
	                    $('#importDialog').modal('toggle');
	                    qrCodeServices.reloadData($scope.qrCodeType);
	                });
	            }
	            else {
	                alert('Vui lòng chọn đúng định dạng excel (.xlsx) cần import');
	            }
	        }
	    }

	    if (!authService.authentication.isAuth)
	        $location.path('/login');
	} ]);