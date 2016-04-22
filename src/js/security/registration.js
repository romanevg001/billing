
angular.module('sdl.management')
    .config(['$stateProvider', '$httpProvider', function ($stateProvider, $httpProvider) {

        $stateProvider.state('registration', {
            url: '/registration',
            templateUrl: 'templates/security/registration.tpl.html',
            controller: ['$rootScope', '$scope', 'authService', '$state', function ($rootScope, $scope, authService,$state) {

                $scope.user = {};
                $scope.authError = null;
                $scope.authReason = false;
                $scope.progress = false;
                $scope.successMessage = false;

                $scope.registration = function(){
                    // Try to reg
                    $scope.progress = false;
                    authService.registration($scope.user.email).then(function(isRegistrated){
                        $scope.progress = false;
                        if (isRegistrated) {
                            $scope.successMessage = true;
                            setTimeout(()=>{
                                $state.go('loginDialog');
                            },3000);

                        }else{
                            $scope.authError = 'invalidCredentials';
                        }
                        $scope.$apply();
                    });
                };

                $scope.ok = function () {
                    // Clear any previous security errors
                    $scope.authError = null;
                    $scope.progress = true;

                    //Check out existing user
                    authService.checkUser($scope.user.email).then(function (data) {
                        if(data.isUserExist) {
                            $state.go('loginDialog');
                        }else{
                            $scope.registration();
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
