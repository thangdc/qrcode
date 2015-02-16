vietsoftApp.controller('QRCodeBHYTCtrl', function ($scope, $http, $resource, qrCodeServices) {

    $scope.image = '';
    $scope.result = {};
    $scope.loading = false;
    $scope.error = '';

    $scope.decode = function () {
        $scope.loading = true;
        qrCodeServices.decodeQRCodeBHYT($scope.image).$promise.then(
            function (response) {
                $scope.loading = false;
                $scope.result = response;
            },
            function (error) {
                $scope.loading = false;
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
