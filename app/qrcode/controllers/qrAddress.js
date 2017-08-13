vietsoftApp.controller('QRAddressCtrl',['$scope', '$http', '$resource', 'ngAuthSettings', 'qrCodeServices', 'authService', 
	function ($scope, $http, $resource, ngAuthSettings, qrCodeServices, authService) {
		
		$scope.controllerUrl = ngAuthSettings.apiServiceBaseUri + '/api/QRAddresses/';
		$scope.dialogId = 'qrCodeAddressDialog';
		
		//qrcodeEmail
		
		$scope.qrCodes = [];
		$scope.qrCodeLoading = false;
		$scope.isLoading = false;
		$scope.qrCodeError = '';
		
		$scope.qrcodeValidate = {
			address: false
		};
		
		$scope.saveButton = 'Tạo mã QR Code';
		
		$scope.qrcodeAddress = {
			item: {
				id: 0,
				address: 'Chợ Bến Thành',
				latitude: '10.772',
				longitude: '106.698',
				createdDate: '',
				updatedDate: ''
			},
			code: ''
		};
		
		$scope.paging = {
			keyword: '',
			pageSize: 10,
			pageIndex: 1, 
			totalCount: 0,
			totalPage: 0,
			from: 0,
			to: 0,
			hasPrevious: false,
			hasNext: true
		};
		
		$scope.map;
		$scope.geocoder;
		$scope.marker;
	
		$scope.resetForm = function(){
			$scope.qrcodeAddress.code = '';
			//$scope.qrcodeAddress.item.address = '';
			//$scope.qrcodeAddress.item.latitude = '';
			//$scope.qrcodeAddress.item.longitude = '';
			$scope.qrcodeValidate.address = false;
			$scope.isValid = true;
		}
		
		$scope.previous = function(){
			if($scope.paging.hasPrevious){
				$scope.paging.pageIndex--;
				if($scope.paging.pageIndex > 1){
				}
				else{
					$scope.paging.hasPrevious = false;
				}
				$scope.listQRCode();
				$scope.paging.hasNext = ($scope.paging.pageIndex < $scope.paging.totalPage);
			}
		}
		
		$scope.next = function(){
			if($scope.paging.hasNext){
				$scope.paging.pageIndex++;
				if($scope.paging.pageIndex < $scope.paging.totalPage){
				}
				else{
					$scope.paging.hasNext = false;
				}
				$scope.listQRCode();
				$scope.paging.hasPrevious = ($scope.paging.pageIndex > 1);
			}
		}
	
		$scope.deleteQRCode = function(id){
			var isDelete = confirm('Bạn có muốn xóa mẫu tin này hay không?');
			if(isDelete){
				$http({method: 'DELETE', url: $scope.controllerUrl + id}).
					success(function(data, status, headers, config) {
						$scope.listQRCode();
					}).
					error(function(data, status, headers, config) {
						
					}
				);
			}
		}
		
		$scope.search = function(){
			$scope.paging.pageIndex = 1;
			$scope.listQRCode();
		}
		
		$scope.enterSearch = function(event){
			if(event.which == 13){
				$scope.listQRCode();
			}
		}
		
		$scope.checkAll = function(event, name){
			$('input[name="'+ name +'"]').prop('checked', event.target.checked);
		}
		
		$scope.listQRCode = function () {
			$scope.qrCodeLoading = true;
			
			var params = {
				PageIndex: $scope.paging.pageIndex,
				PageSize: $scope.paging.pageSize,
				Keyword: $scope.paging.keyword
			};
			
			var url = $scope.controllerUrl + 'paging';
			
			$http({method: 'GET', url: url, params: params}).
				success(function(data, status, headers, config) {
					
					$scope.qrCodes = data.items;
					
					$scope.paging.totalCount = data.totalCount;
					$scope.paging.totalPage = data.totalPages;
					
					$scope.paging.hasNext = $scope.paging.pageIndex < data.totalPages;
					$scope.paging.hasPrevious = $scope.paging.pageIndex > 1;
					$scope.paging.from = $scope.paging.totalCount > 0 ? (($scope.paging.pageIndex - 1) * $scope.paging.pageSize) + 1 : 0;
					$scope.paging.to = $scope.paging.pageIndex * $scope.paging.pageSize < $scope.paging.totalCount ? $scope.paging.pageIndex * $scope.paging.pageSize : $scope.paging.totalCount;
					
					$scope.qrCodeLoading = false;
				}).
				error(function(data, status, headers, config) 
				{
					$scope.qrCodeLoading = false;
				}
			);
		}
		
		$scope.showUpdateQRCode = function(id){
			$scope.resetForm();
			$scope.saveButton = 'Cập nhật QR Code';
			$scope.qrcodeAddress.item.id = id;			
			$http({method: 'GET', url: $scope.controllerUrl + id}).
				success(function(data, status, headers, config) {
					$scope.qrcodeAddress = data;
					$scope.qrcodeAddress.code = "data:image/png;base64," + data.code;
					$('#' + $scope.dialogId).modal('toggle');
					
				}).
				error(function(data, status, headers, config) {
				}
			);
		}
		
		$scope.showQRCodeDialog = function(){
			$scope.resetForm();
			$scope.qrcodeAddress.item.id = 0;
			$scope.saveButton = 'Tạo mã QR Code';
			$('#' + $scope.dialogId).modal('toggle');
		}
		
		$scope.SaveQRCode = function(){			
			$scope.qrcodeValidate.address = false;
			
			$scope.isValid = true;

			if ($scope.qrcodeAddress.item.address.length == 0) {
				$scope.qrcodeValidate.address = true;
				$scope.isValid = false;
			}

			if ($scope.isValid) {
				$scope.isLoading = true;
				
				var jsonData = JSON.stringify($scope.qrcodeAddress.item);
				
				var id = $scope.qrcodeAddress.item.id;
				if(id > 0){
					
					$http.put($scope.controllerUrl + id, jsonData)
					.success(function (data, status, headers, config) {
						$scope.qrcodeAddress.code = "data:image/png;base64," + data.code;
						$scope.isLoading = false;
						$scope.listQRCode();
					})
					.error(function (data, status, header, config) {
						$scope.isLoading = false;
					});
				}
				else{
					$http.post($scope.controllerUrl, jsonData)
					.then(function (result) {
						$scope.isLoading = false;
						$scope.qrcodeAddress.code = '';
						if(result.data.code == undefined){
							$scope.qrCodeError = 'Bạn cần phải đăng nhập để thực hiện chức năng này';					
						}
						else{
							$scope.qrcodeAddress.code = "data:image/png;base64," + result.data.code;
							$scope.listQRCode();
						}
					},
					function (response) {
						$scope.qrCodeError = 'Bạn cần phải đăng nhập để thực hiện chức năng này';
						$scope.isLoading = false;
						$scope.qrcodeAddress.code = '';
					});
				}
			}
		}
		
		$scope.deleteSelectedQRCode = function(){
			var isDelete = confirm('Bạn có muốn xóa mẫu tin này hay không?');
			if(isDelete){
				var listId = [];
				$('input[name="qrcodeAddress"]').each(function(index, item){
					var checked = $(item).prop('checked') == true;
					if(checked){
						listId.push($(item).val());
					}
				});
				
				$http({method: 'DELETE', url: $scope.controllerUrl + 'deleteselected/' + listId.join('|')}).
					success(function(data, status, headers, config) {
						$scope.listQRCode();
						$('input[name="all"]').prop('checked', false);
					}).
					error(function(data, status, headers, config) {
						
					}
				);
			}
		}
		
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
				position: new google.maps.LatLng($scope.qrcodeAddress.item.latitude,
					$scope.qrcodeAddress.item.longitude),
				clickable: true,
				draggable: true
			});

			google.maps.event.addListener($scope.marker, 'drag', function () {
				$scope.qrcodeAddress.item.latitude = Math.round($scope.marker.position.lat() * 1000) / 1000;
				$scope.qrcodeAddress.item.longitude = Math.round($scope.marker.position.lng() * 1000) / 1000;

				$http.get('http://maps.googleapis.com/maps/api/geocode/json?latlng=' + $scope.qrcodeAddress.item.latitude + ',' + $scope.qrcodeAddress.item.longitude + '&sensor=false').success(function (data) {
					if (data.status == "OK") {
						$scope.qrcodeAddress.item.address = data.results[0].formatted_address;
					}
				});
			});
		};

		$scope.lookup_Address = function () {
			var address = $scope.qrcodeAddress.item.address;

			$scope.qrcodeValidate.location = false;
			if (address.length == 0) {
				$scope.qrcodeValidate.location = true;
				$scope.isValid = false;
				return false;
			}

			$scope.geocoder.geocode({ 'address': address }, function (results, status) {
				if (status == google.maps.GeocoderStatus.OK) {

					$scope.qrcodeAddress.item.latitude = Math.round(results[0].geometry.location.k * 1000) / 1000;
					$scope.qrcodeAddress.item.longitude = Math.round(results[0].geometry.location.D * 1000) / 1000;

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
		
		$scope.init = function(){
			if (authService.authentication.isAuth)
				$scope.listQRCode();
			initialize();
		}
		
		$scope.init();
	}
]);