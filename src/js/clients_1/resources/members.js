
angular.module('sdl.clientsModule')
.factory('clientsModule.members', ['$resource', function ($resource) {
    return $resource('http://testbillingapi.azurewebsites.net/api/clients', {}, {
    	search: { method: 'GET' }
    });
}])
.factory('clientsModule.member', ['$resource', function ($resource) {
	return $resource('res/api.member.json', { _id: '@_id' }, {
		//query: { url: 'res/api.member.json:id' },
		update: { method: 'GET' }
	});
}])
.factory('clientsModule.subjects', ['$resource', function ($resource) {
	return $resource('res/api.subjects.json', {}, {
		list: { method: 'GET' }
	});
}])
.factory('clientsModule.regions', ['$resource', function ($resource) {
	return $resource('res/api.regions.json', {}, {
		list: { method: 'GET' }
	});
}])
.factory('clientsModule.pointsName', ['$resource', function ($resource) {
	return $resource('res/api.pointsname.json', {}, {
		list: { method: 'GET' }
	});
}])

;


//.factory('clientsModule.contacts', ['$resource', function ($resource) {
//	return $resource('res/api.contacts.json/:_id', { _id: '@_id' }, {
//		update: { method: 'PUT' }
//	});
//}]);






//.factory('virtoCommerce.customerModule.organizations', ['$resource', function ($resource) {
//	return $resource('api/organizations/:_id', { _id: '@_id' }, {
//		update: { method: 'PUT' }
//	});
//}])
