angular.module('sdl.management')
	.config(['$stateProvider', '$httpProvider', function ($stateProvider, $httpProvider) {

	    $stateProvider.state('loginDialog', {
	        url: '/login',
	        templateUrl: 'templates/security/login.tpl.html',
	        controller: ['$scope', 'authService','$rootScope','$state', function ($scope, authService, $rootScope,$state) {
	            $scope.user = {};
	            $scope.authError = null;
	            $scope.authReason = false;
	            $scope.loginProgress = false;


	            $scope.ok = function () {
	                // Clear any previous security errors
	                $scope.authError = null;
	                $scope.loginProgress = true;

//console.log('boom1')
//
//					$scope.login = function(){
//						console.log('boom2')
						// Try to login
						authService.login($scope.user.email, $scope.user.password, $scope.user.remember)
							.then(function (loggedIn) {
								$scope.loginProgress = false;
								if (!loggedIn) {
									$scope.authError = 'invalidCredentials';
								}
							}, function (x) {
								$scope.loginProgress = false;
								if (angular.isDefined(x.status)) {
									if (x.status === 401) {
										$scope.authError = 'The login or password is incorrect.';
									} else {
										$scope.authError = 'Authentication error (code: ' + x.status + ').';
									}
								} else {
									$scope.authError = 'Authentication error ' + x;
								}
							});
					//}
					//$scope.login();
					//Check out existing user
					//authService.checkUser($scope.user.email);
					//$rootScope.$on('onCheckUser',function(event,data){
					//	if(!data.isUserExist) {
					//		$state.go('registration');
					//	}else{
					//		$scope.login();
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