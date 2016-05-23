angular.module('sdl.management')

    .factory('sdl.management.contracts', ['$resource', function ($resource) {
        return $resource(config.billingApi + '/clients/:Id/contracts', {Id:'@Id'}, {
            list: { method: 'GET' }
        });
    }])
    .factory('sdl.management.contractsave', ['$resource', function ($resource) {
        return $resource(config.billingApi + '/clients/:clientId/contracts/:ContractNumber', {clientId:'@clientId', ContractNumber: '@ContractNumber'}, {
            list: { method: 'PUT' }
        });
    }])
    .factory('sdl.management.contractedit', ['$resource', function ($resource) {
        return $resource(config.billingApi + '/clients/:clientId/contracts/:ContractNumber', {clientId:'@clientId',ContractNumber:'@ContractNumber'}, {
            list: { method: 'POST' }
        });
    }])
    .factory('sdl.management.contractdelete', ['$resource', function ($resource) {
        return $resource(config.billingApi + '/clients/:clientId/contracts/:Id', {clientId:'@clientId',Id:'@Id'}, {
            list: { method: 'DELETE' }
        });
    }])
    .factory('sdl.management.contractsign', ['$resource', function ($resource) {
        return $resource(config.billingApi + '/clients/:clientId/contracts/:ContractNumber/sign', {clientId:'@clientId',ContractNumber:'@ContractNumber'}, {
            list: { method: 'POST' }
        });
    }])

    .factory('sdl.management.AbonType', ['$resource', function ($resource) {
        return $resource(config.billingApi + '/AbonType', {}, {
            list: { method: 'GET' }
        });
    }])
    .factory('sdl.management.Products', ['$resource', function ($resource) {
        return $resource(config.billingApi + '/abontype/:abontypeId/products', {abontypeId:'@abontypeId'}, {
            list: { method: 'GET' }
        });
    }])
    .factory('sdl.management.AvailableContractNumber', ['$resource', function ($resource) {
        return $resource(config.billingApi + '/contracts/:contractNumber/isavailable', {contractNumber:'@contractNumber'}, {
            list: { method: 'GET' }
        });
    }])
    .factory('sdl.management.contractPay', ['$resource', function ($resource) {

        return $resource(config.billingApi + '/clients/:clientId/contracts/:ContractNumber/pay', {clientId:'@clientId', ContractNumber:'@ContractNumber'}, {
            list: { method: 'POST' }
        });
    }])




    .factory('sdl.management.timezone', ['$resource', function ($resource) {
        return $resource('res/api.timezone.json', {}, {
            list: { method: 'GET' }
        });
    }])


    ;