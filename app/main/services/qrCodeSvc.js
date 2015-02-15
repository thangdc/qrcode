vietsoftApp.factory('qrCodeServices', function ($resource, ngAuthSettings) {

    var result = {};

    var _listQrCode = function () {
        return $resource(ngAuthSettings.apiServiceBaseUri + '/api/QRCode/ListQRCode').query();
    }

    var _removeQRCode = function (id) {
        return $resource(ngAuthSettings.apiServiceBaseUri + '/api/QRCode/DeleteQRCode', { id: id }).save();
    }

    result.showQRCode = _listQrCode;
    result.removeQRCode = _removeQRCode;

    return result;

});