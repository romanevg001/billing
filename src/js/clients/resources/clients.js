angular.module('sdl.management')
.factory('sdl.management.clients', ['Restangular', function (Restangular) {
    return Restangular.service('clients');
}])
.factory('sdl.management.clientsave', ['$resource', function ($resource) {
    return $resource('http://testbillingapi.azurewebsites.net/api/clients', {}, {
        list: { method: 'PUT' }
    });
}])
.factory('sdl.management.clientedit', ['$resource', function ($resource) {
    return $resource('http://testbillingapi.azurewebsites.net/api/clients/:Id', {Id:'@Id'}, {
        list: { method: 'POST' }
    });
}])
.factory('sdl.management.cars', ['$resource', function ($resource) {
    return $resource('http://testbillingapi.azurewebsites.net/api/clients/:Id/vehicles', {Id:'@Id'}, {
        list: { method: 'GET' }
    });
}])
.factory('sdl.management.caredit', ['$resource', function ($resource) {
    return $resource('http://testbillingapi.azurewebsites.net/api/clients/:Id/vehicles/:vehiclesId', {Id:'@Id', vehiclesId:'@vehiclesId'}, {
        list: { method: 'POST' }
    });
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