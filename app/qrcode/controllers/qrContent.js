vietsoftApp.controller('QRContentCtrl',['$scope', '$http', '$resource', 'ngAuthSettings', 'qrCodeServices', 'authService', 
	function ($scope, $http, $resource, ngAuthSettings, qrCodeServices, authService) {
		
		$scope.controllerUrl = ngAuthSettings.apiServiceBaseUri + '/api/QRContents/';
		
		$scope.qrCodes = [];
		$scope.qrCodeLoading = false;
		$scope.isLoading = false;
		$scope.qrCodeError = '';
		$scope.qrcodeValidate = false;
		$scope.saveButton = 'Tạo mã QR Code';
		
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
		
		$scope.qrcodeData = {
			item: {
				id: 0,
				content: "",
				createdDate: '',
				updatedDate: ''
			},
			code: ''
		};
	
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
		
		$scope.showUpdateQRContent = function(id){
			$scope.resetForm();
			$scope.saveButton = 'Cập nhật QR Code';
			$scope.qrcodeData.item.id = id;			
			$http({method: 'GET', url: $scope.controllerUrl + id}).
				success(function(data, status, headers, config) {
					$scope.qrcodeData = data;
					$scope.qrcodeData.code = "data:image/png;base64," + data.code;
					$('#qrNewContentDialog').modal('toggle');
					
				}).
				error(function(data, status, headers, config) {
				}
			);
		}
	
		$scope.deleteQRContent = function(id){
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
			var query = $scope.paging.keyword;
			$scope.paging.pageIndex = 1;
			if($scope.paging.keyword == '')
				query = 'EMPTY';
				
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
			
			var query = $scope.paging.keyword;
			if($scope.paging.keyword == ''){
				query = 'EMPTY';
			}
			
			var controller = '/api/QRContents/paging/'+ query +'/'+ $scope.paging.pageSize +'/' + $scope.paging.pageIndex;
			
			$http({method: 'GET', url: ngAuthSettings.apiServiceBaseUri + controller}).
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
		
		$scope.showQRCodeDialog = function(){
			$scope.resetForm();
			$scope.qrcodeData.item.id = 0;
			$scope.saveButton = 'Tạo mã QR Code';
			$('#qrNewContentDialog').modal('toggle');
		}
		
		$scope.SaveQRCode = function(){			
			$scope.qrcodeValidate = false;
			
			$scope.isValid = true;

			if ($scope.qrcodeData.item.content.length == 0) {
				$scope.qrcodeValidate = true;
				$scope.isValid = false;
			}

			if ($scope.isValid) {
				$scope.isLoading = true;
				var controller = '/api/QRContents';
				
				var jsonData = JSON.stringify($scope.qrcodeData.item);
				
				var id = $scope.qrcodeData.item.id;
				if(id > 0){
					
					$http.put(ngAuthSettings.apiServiceBaseUri + controller + '/' + id, jsonData)
					.success(function (data, status, headers, config) {
						$scope.qrcodeData.code = "data:image/png;base64," + data.code;
						$scope.isLoading = false;
						$scope.listQRCode();
					})
					.error(function (data, status, header, config) {
						$scope.isLoading = false;
					});
				}
				else{
					$http.post(ngAuthSettings.apiServiceBaseUri + controller, jsonData)
					.then(function (result) {
						$scope.isLoading = false;
						$scope.qrcodeData.code = '';
						if(result.data.code == undefined){
							$scope.qrCodeError = 'Bạn cần phải đăng nhập để thực hiện chức năng này';					
						}
						else{
							$scope.qrcodeData.code = "data:image/png;base64," + result.data.code;
							$scope.listQRCode();
						}
					},
					function (response) {
						$scope.qrCodeError = 'Bạn cần phải đăng nhập để thực hiện chức năng này';
						$scope.isLoading = false;
						$scope.qrcodeData.code = '';
					});
				}
			}
		}
		
		$scope.deleteSelectedQRCode = function(){
			var isDelete = confirm('Bạn có muốn xóa mẫu tin này hay không?');
			if(isDelete){
				var listId = [];
				$('input[name="qrcodeContentId"]').each(function(index, item){
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
		
		$scope.exportQRCode = function(){
			alert('export');
		}
		
		$scope.importQRCode = function(){
			alert('import');
		}
		
		$scope.resetForm = function(){
			$scope.qrcodeData.code = '';
			$scope.qrcodeData.item.content = '';
			$scope.qrcodeValidate = false;
			$scope.isValid = true;
		}
		
		$scope.init = function(){
			if (authService.authentication.isAuth)
				$scope.listQRCode();
		}
		
		$scope.init();
	}
]);