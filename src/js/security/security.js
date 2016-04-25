angular.module('sdl.management')
	.config(['$stateProvider', '$httpProvider', function ($stateProvider, $httpProvider) {

	    $stateProvider.state('loginDialog', {
	        url: '/login',
	        templateUrl: 'templates/security/login.tpl.html',
	        controller: ['$scope', 'authService','$rootScope','$state', function ($scope, authService, $rootScope,$state) {
	            $scope.user = {};
	            $scope.authReason = false;
	            $scope.loginProgress = false;
				$scope.errorLoginPass = false;
				$scope.errorAuth = false;

				$scope.login = function(){

					// Try to login
					authService.login($scope.user.phone, $scope.user.password, $scope.user.remember)
						.then(function (loggedIn) {
							$scope.loginProgress = false;
							if (!loggedIn) {
								$scope.errorLoginPass = true;
							}
							$scope.$apply();

						}, function (x) {
							$scope.loginProgress = false;
							if (angular.isDefined(x.status)) {
								if (x.status === 401) {
									$scope.errorLoginPass = true;
								} else {
									$scope.errorAuth = true;
								}
							} else {
								$scope.errorAuth = true;

							}
							$scope.$apply();
						});
				}

	            $scope.ok = function () {
	                // Clear any previous security errors

	                $scope.loginProgress = true;

					//Check out existing user
					authService.checkUser($scope.user.phone).then(function (data) {
						if(!data.isUserExist) {
							$state.go('registration');
						}else{
							$scope.login();
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