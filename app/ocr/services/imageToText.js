vietsoftApp.factory('imagToTextServices',
    ['$resource', 'ngAuthSettings',
    function ($resource, ngAuthSettings) {

        var result = {};

        var _decode = function (image) {
            return $resource(ngAuthSettings.apiServiceBaseUri + '/api/ocr/Decode').save({ data: image });
        }

        result.decode = _decode;

        return result;

    }]);