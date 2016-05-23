angular.module('sdl.management')

    .factory('sdl.management.cars', ['$resource', function ($resource) {
        return $resource(config.billingApi + '/clients/:Id/vehicles', {Id:'@Id'}, {
            list: { method: 'GET' }
        });
    }])
    .factory('sdl.management.carsave', ['$resource', function ($resource) {
        return $resource(config.billingApi + '/clients/:clientId/vehicles', {clientId:'@clientId'}, {
            list: { method: 'PUT' }
        });
    }])
    .factory('sdl.management.caredit', ['$resource', function ($resource) {
        return $resource(config.billingApi + '/clients/:clientId/vehicles/:Id', {clientId:'@clientId',Id:'@Id'}, {
            list: { method: 'POST' }
        });
    }])
    .factory('sdl.management.cardelete', ['$resource', function ($resource) {
        return $resource(config.billingApi + '/clients/:clientId/vehicles/:Id', {clientId:'@clientId',Id:'@Id'}, {
            list: { method: 'DELETE' }
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