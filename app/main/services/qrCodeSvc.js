vietsoftApp.factory('qrCodeServices', ['$resource','ngAuthSettings','$rootScope', function ($resource, ngAuthSettings, $rootScope) {

    var result = {};

    var _listQrCode = function (url) {
        return $resource(url).query();
    }

    var _removeQRCode = function (id) {
        return $resource(ngAuthSettings.apiServiceBaseUri + '/api/QRCode/DeleteQRCode', { id: id }).save();
    }

    var _decodeBHYT = function (image) {
        return $resource(ngAuthSettings.apiServiceBaseUri + '/api/QRCode/DecodeBHYT').save({ data: image });
    }

    function reloadData(data) {
        $rootScope.$broadcast('reloadData', { tab: data });
    }

    result.showQRCode = _listQrCode;
    result.removeQRCode = _removeQRCode;
    result.decodeQRCodeBHYT = _decodeBHYT;
    result.reloadData = reloadData;

    return result;

}]);