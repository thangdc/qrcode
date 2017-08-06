vietsoftApp.factory('qrCodeServices', function ($resource, ngAuthSettings) {

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

    result.showQRCode = _listQrCode;
    result.removeQRCode = _removeQRCode;
    result.decodeQRCodeBHYT = _decodeBHYT;

    return result;

});