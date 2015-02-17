vietsoftApp.controller('ImageToTextCtrl',
    ['$scope', '$http', '$resource', 'imagToTextServices',
    function ($scope, $http, $resource, imagToTextServices) {

        $scope.image = '';
        $scope.result = {};
        $scope.loading = false;
        $scope.error = '';

        $scope.decode = function () {
            $scope.loading = true;
            $scope.error = '';
            $scope.result = {};
            imagToTextServices.decode($scope.image).$promise.then(
                function (response) {
                    $scope.loading = false;
                    $scope.ocrResult = response.result;
                },
                function (error) {
                    $scope.loading = false;
                    if ($scope.image == '')
                        $scope.error = 'Vui lòng chọn ảnh cần nhận dạng';
                    else
                        $scope.error = 'Vui lòng đăng nhập để thực hiện chức năng này';
                });
        }
}]);