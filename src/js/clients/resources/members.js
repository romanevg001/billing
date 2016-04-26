
angular.module('sdl.clientsModule')
.factory('clientsModule.members', ['$resource', function ($resource) {
    return $resource('res/api.members.json', {}, {
    	search: { method: 'GET', url: 'res/api.members.json' }
    });
}])
.factory('clientsModule.contacts', ['$resource', function ($resource) {
	return $resource('res/api.contacts.json/:_id', { _id: '@_id' }, {
		update: { method: 'PUT' }
	});
}]);

//.factory('virtoCommerce.customerModule.organizations', ['$resource', function ($resource) {
//	return $resource('api/organizations/:_id', { _id: '@_id' }, {
//		update: { method: 'PUT' }
//	});
//}])
