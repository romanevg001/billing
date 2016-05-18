angular.module('sdl.management')

    .factory('sdl.management.contracts', ['$resource', function ($resource) {
        return $resource('http://testbillingapi.azurewebsites.net/api/clients/:Id/contracts', {Id:'@Id'}, {
            list: { method: 'GET' }
        });
    }])
    .factory('sdl.management.contractsave', ['$resource', function ($resource) {
        return $resource('http://testbillingapi.azurewebsites.net/api/clients/:clientId/contracts', {clientId:'@clientId'}, {
            list: { method: 'PUT' }
        });
    }])
    .factory('sdl.management.contractedit', ['$resource', function ($resource) {
        return $resource('http://testbillingapi.azurewebsites.net/api/clients/:clientId/contracts/:Id', {clientId:'@clientId',Id:'@Id'}, {
            list: { method: 'POST' }
        });
    }])
    .factory('sdl.management.contractdelete', ['$resource', function ($resource) {
        return $resource('http://testbillingapi.azurewebsites.net/api/clients/:clientId/contracts/:Id', {clientId:'@clientId',Id:'@Id'}, {
            list: { method: 'DELETE' }
        });
    }])

    .factory('sdl.management.AbonType', ['$resource', function ($resource) {
        return $resource('http://testbillingapi.azurewebsites.net/api/AbonType', {}, {
            list: { method: 'GET' }
        });
    }])
    .factory('sdl.management.Products', ['$resource', function ($resource) {
        return $resource('http://testbillingapi.azurewebsites.net/api/abontype/:abontypeId/products', {abontypeId:'@abontypeId'}, {
            list: { method: 'GET' }
        });
    }])



    .factory('sdl.management.timezone', ['$resource', function ($resource) {
        return $resource('res/api.timezone.json', {}, {
            list: { method: 'GET' }
        });
    }])


    ;