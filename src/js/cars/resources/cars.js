angular.module('sdl.management')

.factory('sdl.management.clients', ['Restangular', function (Restangular) {
    return Restangular.service('clients');
}])

.factory('sdl.management.carsave', ['$resource', function ($resource) {
    return $resource('http://testbillingapi.azurewebsites.net/api/clients/:Id/vehicles', {Id:'@clientId'}, {
        list: { method: 'PUT' }
    });
}])

.factory('sdl.management.cars', ['$resource', function ($resource) {
    return $resource('http://testbillingapi.azurewebsites.net/api/clients/:Id/vehicles', {Id:'@Id'}, {
        list: { method: 'GET' }
    });
}])

.factory('sdl.management.colors', ['$resource', function ($resource) {
    return $resource('res/api.colorcars.json', {}, {
        list: { method: 'GET' }
    });
}])

.factory('sdl.management.makes', ['$resource', function ($resource) {
    return $resource('res/api.marka.json', {}, {
        list: { method: 'GET' }
    });
}])
.factory('sdl.management.models', ['$resource', function ($resource) {
    return $resource('res/api.models.json', {}, {
        list: { method: 'GET' }
    });
}])

;