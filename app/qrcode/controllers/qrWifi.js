vietsoftApp.controller('QRWifiCtrl',['$scope', '$http', '$resource', 'ngAuthSettings', 'qrCodeServices', 'authService', 
	function ($scope, $http, $resource, ngAuthSettings, qrCodeServices, authService) {
		
		$scope.controllerUrl = ngAuthSettings.apiServiceBaseUri + '/api/QRWifis/';
		$scope.dialogId = 'qrCodeWifiDialog';
		
		//qrcodeEmail
		
		$scope.qrCodes = [];
		$scope.qrCodeLoading = false;
		$scope.isLoading = false;
		$scope.qrCodeError = '';
		
		$scope.qrcodeValidate = {
			ssid: false,
			password: false
		}
		
		$scope.saveButton = 'Tạo mã QR Code';
		
		$scope.qrcodeWifi = {
			item: {
				id: 0,
				ssid: '',
				password: '',
				networkType: '',
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
		
		$scope.resetForm = function(){
			$scope.qrcodeWifi.code = '';
			$scope.qrcodeWifi.item.ssid = '';
			$scope.qrcodeWifi.item.password = '';
			//$scope.qrcodeWifi.item.networkType = '';
			$scope.qrcodeValidate.ssid = false;
			$scope.qrcodeValidate.password = false;
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
			$scope.qrcodeWifi.item.id = id;			
			$http({method: 'GET', url: $scope.controllerUrl + id}).
				success(function(data, status, headers, config) {
					$scope.qrcodeWifi = data;
					$scope.qrcodeWifi.code = "data:image/png;base64," + data.code;
					$('#' + $scope.dialogId).modal('toggle');
					
				}).
				error(function(data, status, headers, config) {
				}
			);
		}
		
		$scope.showQRCodeDialog = function(){
			$scope.resetForm();
			$scope.qrcodeWifi.item.id = 0;
			$scope.saveButton = 'Tạo mã QR Code';
			$('#' + $scope.dialogId).modal('toggle');
		}
		
		$scope.SaveQRCode = function(){			
			$scope.qrcodeValidate.ssid = false;
			$scope.qrcodeValidate.password = false;
			
			$scope.isValid = true;

			if ($scope.qrcodeWifi.item.ssid.length == 0) {
				$scope.qrcodeValidate.ssid = true;
				$scope.isValid = false;
			}
			if ($scope.qrcodeWifi.item.password.length == 0) {
				$scope.qrcodeValidate.password = true;
				$scope.isValid = false;
			}

			if ($scope.isValid) {
				$scope.isLoading = true;
				
				var jsonData = JSON.stringify($scope.qrcodeWifi.item);
				
				var id = $scope.qrcodeWifi.item.id;
				if(id > 0){
					
					$http.put($scope.controllerUrl + id, jsonData)
					.success(function (data, status, headers, config) {
						$scope.qrcodeWifi.code = "data:image/png;base64," + data.code;
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
						$scope.qrcodeWifi.code = '';
						if(result.data.code == undefined){
							$scope.qrCodeError = 'Bạn cần phải đăng nhập để thực hiện chức năng này';					
						}
						else{
							$scope.qrcodeWifi.code = "data:image/png;base64," + result.data.code;
							$scope.listQRCode();
						}
					},
					function (response) {
						$scope.qrCodeError = 'Bạn cần phải đăng nhập để thực hiện chức năng này';
						$scope.isLoading = false;
						$scope.qrcodeWifi.code = '';
					});
				}
			}
		}
		
		$scope.deleteSelectedQRCode = function(){
			var isDelete = confirm('Bạn có muốn xóa mẫu tin này hay không?');
			if(isDelete){
				var listId = [];
				$('input[name="qrcodeWifi"]').each(function(index, item){
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
		
		$scope.init = function(){
			if (authService.authentication.isAuth)
				$scope.listQRCode();
		}
		
        $scope.$on('reloadData', function (event, data) {
	        if (data.tab == 'Wifi') {
	            $scope.init();
	        }
	    });

		$scope.init();
	}
]);