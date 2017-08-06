vietsoftApp.controller('QRCodeCtrl', 
	function ($scope, $http, $resource, ngAuthSettings, qrCodeServices, authService) {
    	
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
