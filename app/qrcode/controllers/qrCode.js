vietsoftApp.controller('QRCodeCtrl', 
	function ($scope, $http, $resource, ngAuthSettings, qrCodeServices, authService) {
    $scope.qrCodes = [];

    $scope.qrcodeData = {
        type: "vanban",
        text: {
            Message: ""
        },
        sms: {
            Number: "",
            Message: ""
        },
        email: {
            EmailAddress: "",
            Title: "",
            Content: ""
        },
        phone: {
            Number: ""
        },
        contact: {
            FullName: "",
            Phone: "",
            Email: "",
            Address: "",
            Website: "",
            Note: ""
        },
        location: {
            Address: "Chợ Bến Thành",
            Latitude: "10.772",
            Longitude: "106.698"
        },
        website: {
            Url: ""
        },
        encrypt: {
            IsEncrypt: false,
            Password: "",
            Hours: 0,
            Minutes: 0
        },
        result: {
            IsLoading: false,
            Value: ""
        }
    };

    $scope.qrcodeValidate = {
        text: {
            error: false
        },
        sms: {
            number: false,
            message: false
        },
        email: {
            address: false,
            subject: false,
            body: false
        },
        phone: {
            error: false
        },
        contact: {
            fullName: false,
            phone: false,
            email: false,
            address: false,
            website: false
        },
        location: {
            error: false
        },
        website: {
            error: false
        },
        encrypt: {
            error: false
        }
    };

    $scope.isValid = true;
    $scope.qrCodeError = '';

    $scope.generateQRCode = function () {

        var qrCodeData = $scope.qrcodeData;
	$scope.qrCodeError = '';
	
        $scope.qrcodeValidate.text.error = false;
        $scope.qrcodeValidate.sms.number = false;
        $scope.qrcodeValidate.sms.message = false;
        $scope.qrcodeValidate.email.address = false;
        $scope.qrcodeValidate.email.subject = false;
        $scope.qrcodeValidate.email.body = false;
        $scope.qrcodeValidate.phone.error = false;
        $scope.qrcodeValidate.contact.phone = false;
        $scope.qrcodeValidate.contact.email = false;
        $scope.qrcodeValidate.location.error = false;
        $scope.qrcodeValidate.website.error = false;
        
        $scope.isValid = true;

        switch (qrCodeData.type) {
            case 'vanban':
                if (qrCodeData.text.Message.length == 0) {
                    $scope.qrcodeValidate.text.error = true;
                    $scope.isValid = false;
                }
                break;
            case 'tinnhansms':
                if (qrCodeData.sms.Number.length == 0) {
                    $scope.qrcodeValidate.sms.number = true;
                    $scope.isValid = false;
                }
                if (qrCodeData.sms.Message.length == 0) {
                    $scope.qrcodeValidate.sms.message = true;
                    $scope.isValid = false;
                }
                break;
            case 'email':
                if (qrCodeData.email.EmailAddress.length == 0) {
                    $scope.qrcodeValidate.email.address = true;
                    $scope.isValid = false;
                }
                if (qrCodeData.email.Title.length == 0) {
                    $scope.qrcodeValidate.email.subject = true;
                    $scope.isValid = false;
                }
                if (qrCodeData.email.Content.length == 0) {
                    $scope.qrcodeValidate.email.body = true;
                    $scope.isValid = false;
                }
                break;
            case 'dienthoai':
                if (qrCodeData.phone.Number.length == 0) {
                    $scope.qrcodeValidate.phone.error = true;
                    $scope.isValid = false;
                }
                break;
            case 'lienhe':
                if (qrCodeData.contact.Phone.length == 0) {
                    $scope.qrcodeValidate.contact.phone = true;
                    $scope.isValid = false;
                }
                if (qrCodeData.contact.Email.length == 0) {
                    $scope.qrcodeValidate.contact.email = true;
                    $scope.isValid = false;
                }
                break;
            case 'diachi':
                if (qrCodeData.location.Address.length == 0) {
                    $scope.qrcodeValidate.location.error = true;
                    $scope.isValid = false;
                }
                break;
            case 'url':
                if (qrCodeData.website.Url.length == 0) {
                    $scope.qrcodeValidate.website.error = true;
                    $scope.isValid = false;
                }
                break;
            default:
                break;
        }

        if ($scope.isValid) {
            $scope.qrcodeData.result.IsLoading = true;

            $http.post(ngAuthSettings.apiServiceBaseUri + '/api/QRCode/Generate', JSON.stringify(qrCodeData))
            .then(function (result) {
				if(result.indexOf('<!DOCTYPE html>') != -1){
					$scope.qrCodeError = 'Bạn cần phải đăng nhập để thực hiện chức năng này';
					$scope.qrcodeData.result.IsLoading = false;
					$scope.qrcodeData.result.Value = '';
				}
				else{
					$scope.qrcodeData.result.IsLoading = false;
					$scope.qrcodeData.result.Value = "data:image/png;base64," + result.data;
					listQRCode();
				}
            },
            function (response) {
                $scope.qrCodeError = 'Bạn cần phải đăng nhập để thực hiện chức năng này';
                $scope.qrcodeData.result.IsLoading = false;
                $scope.qrcodeData.result.Value = '';
            });
        }
    };

    $scope.map;
    $scope.geocoder;
    $scope.marker;

    initialize();

    function initialize() {
        $scope.geocoder = new google.maps.Geocoder();
        var latlng = new google.maps.LatLng(10.774411, 106.692696);
        var mapOptions = {
            zoom: 17,
            center: latlng
        }
        $scope.map = new google.maps.Map(document.getElementById("map_canvas"),
			mapOptions);

        $scope.marker = new google.maps.Marker({
            map: $scope.map,
            position: new google.maps.LatLng($scope.qrcodeData.location.Latitude,
                $scope.qrcodeData.location.Longitude),
            clickable: true,
            draggable: true
        });

        google.maps.event.addListener($scope.marker, 'drag', function () {
            $scope.qrcodeData.location.Latitude = Math.round($scope.marker.position.lat() * 1000) / 1000;
            $scope.qrcodeData.location.Longitude = Math.round($scope.marker.position.lng() * 1000) / 1000;

            $http.get('http://maps.googleapis.com/maps/api/geocode/json?latlng=' + $scope.qrcodeData.location.Latitude + ',' + $scope.qrcodeData.location.Longitude + '&sensor=false').success(function (data) {
                if (data.status == "OK") {
                    $scope.qrcodeData.location.Address = data.results[0].formatted_address;
                }
            });
        });
    };

    $scope.lookup_Address = function () {
        var address = $scope.qrcodeData.location.Address;

        $scope.qrcodeValidate.location.error = false;
        if (address.length == 0) {
            $scope.qrcodeValidate.location.error = true;
            $scope.isValid = false;
            return false;
        }

        $scope.geocoder.geocode({ 'address': address }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {

                $scope.qrcodeData.location.Latitude = Math.round(results[0].geometry.location.k * 1000) / 1000;
                $scope.qrcodeData.location.Longitude = Math.round(results[0].geometry.location.D * 1000) / 1000;

                $scope.map.setCenter(results[0].geometry.location);

                if (!$scope.marker) {
                    $scope.marker = new google.maps.Marker({
                        map: $scope.map,
                        position: results[0].geometry.location,
                        clickable: true,
                        draggable: true
                    });
                }
                else {
                    $scope.marker.setPosition(results[0].geometry.location);
                }

            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    };

    $scope.removeQRCode = function (id) {
        qrCodeServices.removeQRCode(id).$promise.then(function(){
            listQRCode();
        });
    };

    if (authService.authentication.isAuth)
		listQRCode();
		
    $scope.qrCodes = [];
    $scope.qrCodeLoading = false;
    function listQRCode() {
        $scope.qrCodeLoading = true;
        qrCodeServices.showQRCode().$promise.then(function (response) {
            $scope.qrCodes = response;
            $scope.qrCodeLoading = false;
        }, function () {
            $scope.qrCodeLoading = false;
        });
    }

}).directive('showtab', function () {
    return {
        link: function (scope, element, attrs) {
            element.click(function (e) {
                if (scope.qrcodeData)
                    scope.qrcodeData.type = attrs.href.substr(1, attrs.href.length);
                e.preventDefault();
                $(element).tab('show');
                if (scope.map)
                    google.maps.event.trigger(scope.map, "resize");
            });
        }
    };
}).filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});
