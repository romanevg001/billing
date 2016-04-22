angular.module('sdl.management')
	.config(['$stateProvider', '$httpProvider', function ($stateProvider, $httpProvider) {

	    $stateProvider.state('restorePassword', {
	        url: '/restorepassword',
	        templateUrl: 'templates/security/restore.tpl.html',
	        controller: ['$scope', 'authService','$rootScope','$state', function ($scope, authService, $rootScope,$state) {
				let _scope = ()=>{return $scope};

	            $scope.user = {};
	            $scope.authError = null;
	            $scope.authReason = false;
	            $scope.progress = false;
	            $scope.successMessage = false;
				$scope.proveResetPassword = false;

	            $scope.resetPassword = function () {
					$scope.authError = null;
					$scope.progress = true;

					authService.confirmResetPassword($scope.user.email, $scope.user.resetCode).then(function (data) {
						$scope.progress = false;
						$scope.successMessage = true;

						setTimeout(()=>{
							$state.go('loginDialog');
						},3000);

						$scope.$apply();
					});
				};


				$scope.restorePassword = function(scope){

					authService.resetPassword($scope.user.email).then(function (data) {
						$scope.authError = null;
						$scope.progress = false;
						$scope.proveResetPassword = true;
						$scope.$apply();
					});


				};


	            $scope.ok = function () {
	                // Clear any previous security errors
	                $scope.authError = null;
	                $scope.progress = true;

					//Check out existing user
					authService.checkUser($scope.user.email).then(function(data){
						if(data.isUserExist){
							$scope.restorePassword();
						}else{
							$state.go('registration');
						}
					});

					//$scope.$on('onCheckUser',function(event,data){
					//	if(data.isUserExist) {
					//		//$scope.restorePassword();
					//		_scope().proveResetPassword = true;
                    //
					//		console.log('ddd')
					//		_scope().progress = false;
					//		//$scope.proveResetPassword = true;
                    //
					//	}else{
					//		$state.go('registration');
					//	}
					//});
	            };

	        }]
	    });
	}])
    .run(['$rootScope', 'mainMenuService', 'sdl.management.widgetService',
        '$state', 'authService',
        function ($rootScope, mainMenuService, widgetService, $state, authService) {

    }]);