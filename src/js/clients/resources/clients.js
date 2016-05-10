angular.module('sdl.management')
.factory('sdl.management.clients', ['Restangular', function (Restangular) {
    return Restangular.service('clients');
}])
.factory('sdl.management.subjects', ['$resource', function ($resource) {
    return $resource('res/api.subjects.json', {}, {
        list: { method: 'GET' }
    });
}])
.factory('sdl.management.regions', ['$resource', function ($resource) {
    return $resource('res/api.regions.json', {}, {
        list: { method: 'GET' }
    });
}])
.factory('sdl.management.pointsName', ['$resource', function ($resource) {
    return $resource('res/api.pointsname.json', {}, {
        list: { method: 'GET' }
    });
}]);