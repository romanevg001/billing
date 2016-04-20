angular.module('sdl.management')
.factory('sdl.management.settings',
    ['Restangular', function (Restangular) {
        Restangular.setFullResponse(true);
        
        return Restangular.service('settings');
}]);