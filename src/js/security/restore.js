﻿angular.module('sdl.management')
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

					authService.login($scope.user.phone, $scope.user.resetCode).then(function (data) {
						$scope.progress = false;
						$scope.successMessage = true;
						$scope.$apply();

						setTimeout(()=>{
							$state.go('workspace');
						},1500);
					});
					//authService.confirmResetPassword($scope.user.phone, $scope.user.resetCode).then(function (data) {
					//	$scope.progress = false;
					//	$scope.successMessage = true;
                    //
					//	setTimeout(()=>{
					//		$state.go('loginDialog');
					//	},3000);
                    //
					//	$scope.$apply();
					//});
				};


				$scope.restorePassword = function(scope){

					authService.resetPassword($scope.user.phone).then(function (data) {
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
					authService.checkUser($scope.user.phone).then(function(data){
						if(data.isUserExist){
							$scope.restorePassword();
						}else{
							$state.go('registration');
						}
					});

	            };

	        }]
	    });
	}])
    .run(['$rootScope', 'mainMenuService', 'sdl.management.widgetService',
        '$state', 'authService',
        function ($rootScope, mainMenuService, widgetService, $state, authService) {

    }]);