vietsoftApp.controller('QRCodeBHYTCtrl', function ($scope, $http, $resource, qrCodeServices) {

    $scope.image = '';
    $scope.result = {};

    $scope.decode = function () {
        qrCodeServices.decodeQRCodeBHYT($scope.image).$promise.then(
            function (response) {
                $scope.result = response;
            },
            function (error) {
                console.log(error);
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