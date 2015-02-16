vietsoftApp.controller('QRCodeBHYTCtrl', function ($scope, $http, $resource, qrCodeServices) {

    $scope.image = '';
    $scope.result = {};
    $scope.loading = false;
    $scope.error = '';

    $scope.decode = function () {
        $scope.loading = true;
        $scope.error = '';
		$scope.result = {};
		$scope.image = '';
        qrCodeServices.decodeQRCodeBHYT($scope.image).$promise.then(
            function (response) {
                $scope.loading = false;
                $scope.result = response;
            },
            function (error) {
                $scope.loading = false;
                if($scope.image == '')
                    $scope.error = 'Vui lòng chọn ảnh thẻ BHYT cần xem thông tin';
                else if(error.status == 400)
                    $scope.error = 'Ảnh thẻ BHYT chưa đúng, vui lòng thử lại ảnh khác.';
                else
                    $scope.error = 'Vui lòng đăng nhập để thực hiện chức năng này';
            });
    }

}).directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.fileread = loadEvent.target.result;
                    });
                }
                reader.readAsDataURL(changeEvent.target.files[0]);
            });
        }
    }
}]);
