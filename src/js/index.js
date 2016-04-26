import "./../../node_modules/angular-ui-mask/dist/mask"
import "./../../node_modules/angular-jwt/dist/angular-jwt"


(function(){
    var app = angular.module('sdl.management', [
        'angularMoment',
        'ui.router',
        'gridster',
        'ngStorage',
        'ngCookies',
        'ui.bootstrap',
        'restangular',
        'pascalprecht.translate',
        'ui.mask',
        'ngResource',
        'angular-jwt',
        'sdl.clientsModule',
        'ui.grid', 'ui.grid.autoResize', 'ui.grid.resizeColumns', 'ui.grid.moveColumns', 'ui.grid.saveState',
        'ui.grid.selection', 'ui.grid.pagination', 'ui.grid.pinning', 'ui.grid.grouping'
    ]);


    app.controller('sdl.management.appCtrl', [
        function() {
        }
    ]);



    app.provider('$domain', function  (){

            this.getDomain = function() {
                return new Domain0({
                    domain: 'http://auth.smartdriving.io/api'
                    //domain: 'http://test-domain0.azurewebsites.net/api'
                }, 'domain0');
            };

            this.$get = function() {
                return this.getDomain()
            }

    });

    app.factory('sdl.management.httpErrorInterceptor', [
        '$q', '$rootScope', function($q, $rootScope) {
            var httpErrorInterceptor = {};

            httpErrorInterceptor.responseError = function(rejection) {
                if (rejection.status === 401) {
                    $rootScope.$broadcast('unauthorized', rejection);
                } else {
                    $rootScope.$broadcast('httpError', rejection);
                }
                return $q.reject(rejection);
            };
            httpErrorInterceptor.requestError = function(rejection) {
                $rootScope.$broadcast('httpError', rejection);
                return $q.reject(rejection);
            };

            return httpErrorInterceptor;
        }
    ]);

    app.config(['RestangularProvider',
       function(RestangularProvider) {
           RestangularProvider.setBaseUrl('res'); //api/platform
       }]);


    app.config([
        '$stateProvider', '$translateProvider', '$httpProvider','jwtInterceptorProvider', '$urlRouterProvider','$domainProvider',
        function ($stateProvider, $translateProvider, $httpProvider, jwtInterceptorProvider, $urlRouterProvider, $domainProvider) {

            jwtInterceptorProvider.tokenGetter = [function () {
                return $domainProvider.getDomain().access_token.get();
            }];

            $httpProvider.interceptors.push('jwtInterceptor');

            //Localization
            // https://angular-translate.github.io/docs/#/guide
            // var defaultLanguage = settings.getValues({ id: 'VirtoCommerce.Platform.General.ManagerDefaultLanguage' });
            $translateProvider
                .useStaticFilesLoader({
                    files:           [{
                        prefix: 'res/',
                        suffix: '.SDL.Platform.json'
                    },
                    {
                    prefix: 'res/',
                    suffix: '.SDL.BillingModules.json'
                }]
            })
            .useLoaderCache(true)
            .useSanitizeValueStrategy('escapeParameters')
            .preferredLanguage('ru')
            .fallbackLanguage('ru')
            .useLocalStorage();

            $stateProvider.state('workspace', {
                url: '/workspace',
                templateUrl: 'templates/workspace.tpl.html'
            });


            //Add interceptor
            $httpProvider.interceptors.push('sdl.management.httpErrorInterceptor');
            $urlRouterProvider.otherwise('/workspace');
        }
    ]);

    app.run(['amMoment', 'gridsterConfig', 'mainMenuService', '$state',
        '$rootScope', 'authService',
        function (amMoment, gridsterConfig, mainMenuService, $state,
            $rootScope, authService) {
        amMoment.changeLocale('ru');

        var homeMenuItem = {
            path: 'home',
            title: 'platform.menu.home',
            icon: 'fa fa-home',
            action: function () { $state.go('workspace'); },
            priority: 0
        };
        mainMenuService.addMenuItem(homeMenuItem);

        var browseMenuItem = {
            path: 'browse',
            icon: 'fa fa-search',
            title: 'platform.menu.browse',
            priority: 90
        };
        mainMenuService.addMenuItem(browseMenuItem);

        var cfgMenuItem = {
            path: 'configuration',
            icon: 'fa fa-wrench',
            title: 'platform.menu.configuration',
            priority: 91
        };
        mainMenuService.addMenuItem(cfgMenuItem);

        $rootScope.$on('unauthorized', function (event, rejection) {
            if (!authService.isAuthenticated) {
                $state.go('loginDialog');
            }
        });

        $rootScope.$on('loginStatusChanged', function (event, authContext) {
            if (authContext.isAuthenticated) {
                console.log('State - ' + $state.current.name);
                if (!$state.current.name || $state.current.name === 'loginDialog') {
                    homeMenuItem.action();
                }
            }
            else {
                $state.go('loginDialog');
            }
        });

        gridsterConfig.columns = 4;
        gridsterConfig.colWidth = 130;
        gridsterConfig.defaultSizeX = 1;
        gridsterConfig.resizable = { enabled: false, handles: [] };
        gridsterConfig.maxRows = 8;
        gridsterConfig.mobileModeEnabled = false;
        gridsterConfig.outerMargin = false;
    }]);


})()
