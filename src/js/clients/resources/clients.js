angular.module('sdl.management')
.factory('sdl.management.clients', ['Restangular', function (Restangular) {
    return Restangular.service('clients');
}]);