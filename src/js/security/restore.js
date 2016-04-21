angular.module('sdl.management')
	.config(['$stateProvider', '$httpProvider', function ($stateProvider, $httpProvider) {

	    $stateProvider.state('restorePassword', {
	        url: '/restorepassword',
	        templateUrl: 'templates/security/restore.tpl.html',
	        controller: ['$scope', 'authService','$rootScope','$state', function ($scope, authService, $rootScope,$state) {
	            $scope.user = {};
	            $scope.authError = null;
	            $scope.authReason = false;
	            $scope.progress = false;
	            $scope.ok = function () {
	                // Clear any previous security errors
	                $scope.authError = null;
	                $scope.progress = true;

					//Check out existing user
					//authService.checkUser($scope.user.email);
					//$rootScope.$on('onCheckUser',function(event,data){
					//	if(!data.isUserExist) {
					//		$state.go('registration');
					//	}else{
					//		$scope.restorePassword();
					//	}
					//});

					$scope.restorePassword = function(){
						$scope.progress = false;

						authService.restorePassword($scope.user.email).then(function (data) {

							console.log(data)

						});
					};
					$scope.restorePassword();
	            };

	        }]
	    });
	}])
    .run(['$rootScope', 'mainMenuService', 'sdl.management.widgetService',
        '$state', 'authService',
        function ($rootScope, mainMenuService, widgetService, $state, authService) {

    }]);