﻿angular.module("sdl.management")
.config(
  ['$stateProvider', 'billingTemplatesBase','$sceDelegateProvider',
      'RestangularProvider',
      function ($stateProvider, billingTemplatesBase, $sceDelegateProvider, RestangularProvider) {
          {
              RestangularProvider.setBaseUrl('http://testbillingapi.azurewebsites.net/api/');
//              RestangularProvider.setBaseUrl('http://localhost:7536/api/');
              RestangularProvider.setDefaultHeaders({
                  Accept: "application/x-protobuf"
                  //,Authorization: 'bearer ' + domain0UI._access_token
              });
              RestangularProvider.setDefaultHttpFields({
                  'withCredentials': true
              });

              let builder  = dcodeIO.ProtoBuf.loadProtoFile("model/BillingMessage.proto");
              let messaging = builder.build("Messaging");
              //let mes = new Messaging.PagingInfo();
           //   console.log(messaging)
              //console.log(ProtoBuf)
              //var proto = dcodeIO.ProtoBuf.loadJsonFile("model/messaging.json");
              //var messaging = proto.build("Messaging");
              var clientsCollectionMessage = messaging.ClientsCollectionMessage;

              RestangularProvider.addResponseInterceptor(function (data, operation, what, url, response, deferred) {

                      if (what === 'clients' && operation === 'getList') {
                          var decodedClients = clientsCollectionMessage.decode(data);
                          return decodedClients.Data;
                      }
                      var extractedData = data.data;
                      return extractedData;
                  });

              RestangularProvider.addRequestInterceptor(function (data, operation, what, url, response, deferred) {
                  if (what === 'clients' && operation === 'put') {
                      
                      var encodedClients =  new messaging.Client(data);

                      let buff = encodedClients.toArrayBuffer();			
			            return buff;
                  }
              }); 

              // ..or use the full request interceptor, setRequestInterceptor's more powerful brother!
              RestangularProvider.setFullRequestInterceptor(function (element, operation, route, url, headers, params, httpConfig) {

                        if (route === 'clients' && operation === 'put') {
                              headers['Content-Type'] = 'application/x-protobuf';
                   return {
                      element: element,
                      params: params,
                      headers: headers,
                      httpConfig:  { responseType: 'arraybuffer', transformRequest: angular.identity }
                  };

			}
                  return {
                      element: element,
                      params: params,
                      headers: headers,
                      httpConfig:  { responseType: 'arraybuffer' }
                  };
              });
          }

          $sceDelegateProvider.resourceUrlWhitelist(['**']);

      $stateProvider
          .state('workspace.modulesClients', {
              url: '/clients',
              templateUrl: billingTemplatesBase + 'templates/clients/clients.tpl.html',
              controller: ['$scope', 'sdl.management.bladeNavigationService',
                  function ($scope, bladeNavigationService) {

                      var blade = {
                          id: 'clients',
                          title: 'modules.blades.clients.title',
                          //subtitle: 'Manage settings',
                          controller: 'sdl.management.clientsListController',
                          template: billingTemplatesBase +
                              'templates/clients/blades/clientsGroup-list.tpl.html',
                          isClosingDisabled: true
                      };
                  bladeNavigationService.showBlade(blade);
              }]
          })
          .state('workspace.modulesClient', {
              url: '/clients/:id',
              templateUrl: billingTemplatesBase + 'templates/clients/blades/clients-detail.tpl.html',
              controller: ['$scope', 'sdl.management.bladeNavigationService', '$stateParams', '$localStorage',
                  function ($scope, bladeNavigationService,  $stateParams, $localStorage) {



                      console.log(bladeNavigationService)
                      let blade = $localStorage["clients_blade"];
                      var selectedClient = _.where(blade.allClients, { Id: $stateParams.id })[0];
                      var newBlade = {
                          id: 'clientsSection',
                          data: selectedClient,
                          title: 'clients.blades.member-detail.title',
                          controller: 'sdl.management.clientsDetailController',
                          template: billingTemplatesBase + 'templates/clients/blades/clients-detail.tpl.html'
                      };

                      bladeNavigationService.showBlade(newBlade,blade);
                  }]
          });
      ;
  }]
)
.run(
  ['$rootScope', 'mainMenuService', 'sdl.management.widgetService', '$state',
      function ($rootScope, mainMenuService, widgetService, $state) {
      //Register module in main menu
      var menuItem = {
          path: 'clients',
          icon: 'fa fa-user',
          title: 'modules.menu.clients',
          priority: 5,
          action: function () { $state.go('workspace.modulesClients'); },
          permission: 'modules:clients:access'
      };
      mainMenuService.addMenuItem(menuItem);
  }])

.factory('sdl.management.clients.helper', [function () {
    var retVal = {};
    retVal.fixValues = function (settings) {
        // parse values as they all are strings
        var selectedSettings = _.where(settings, { valueType: 'Integer' });
        _.forEach(selectedSettings, function (setting) {
            setting.value = parseInt(setting.value, 10);
            if (setting.allowedValues) {
                setting.allowedValues = _.map(setting.allowedValues, function (value) { return parseInt(value, 10); });
            }
        });

        selectedSettings = _.where(settings, { valueType: 'Decimal' });
        _.forEach(selectedSettings, function (setting) {
            setting.value = parseFloat(setting.value);
            if (setting.allowedValues) {
                setting.allowedValues = _.map(setting.allowedValues, function (value) { return parseFloat(value); });
            }
        });

        selectedSettings = _.where(settings, { valueType: 'Boolean' });
        _.forEach(selectedSettings, function (setting) {
            setting.value = setting.value && setting.value.toLowerCase() === 'true';
            if (setting.allowedValues) {
                setting.allowedValues = _.map(setting.allowedValues, function (value) { return value.toLowerCase() === 'true'; });
            }
        });

        selectedSettings = _.where(settings, { isArray: true });
        _.forEach(selectedSettings, function (setting) {
            if (setting.arrayValues) {
                setting.arrayValues = _.map(setting.arrayValues, function (x) { return { value: x }; });
            }
        });
    };

    return retVal;
}]);