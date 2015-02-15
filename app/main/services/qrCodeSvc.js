vietsoftApp.factory('qrCodeServices', function ($resource) {

    var result = {};

    var _listQrCode = function () {
        return $resource('/api/QRCode/ListQRCode').query();
    }

    var _removeQRCode = function (id) {
        return $resource('/api/QRCode/DeleteQRCode', { id: id }).save();
    }

    result.showQRCode = _listQrCode;
    result.removeQRCode = _removeQRCode;

    return result;

});