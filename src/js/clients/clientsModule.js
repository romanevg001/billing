//moduleName = "virtoCommerce.customerModule";
//AppDependencies != undefined && AppDependencies.push(moduleName);

angular.module("sdl.clientsModule",[])
    .config(["$stateProvider", function($stateProvider) {

        $stateProvider.state("workspace.clientsModule", {
            url: "/clients",
            templateUrl: "templates/common/home.tpl.html",
            controller: ["$scope", "sdl.management.bladeNavigationService", function($scope, $bladeNavigationService) {
                $bladeNavigationService.showBlade({
                    id: "memberList",
                    currentEntity: {
                        id: null
                    },
                    controller: "clientsModule.memberListController",
                    template: "templates/clients/member-list.tpl.html",
                    isClosingDisabled: !0
                })
            }]
        })

    }])

    .run(["$rootScope", "mainMenuService", "sdl.management.widgetService", "$state", function($rootScope, $mainMenuService, $widgetService, $state) {
        $mainMenuService.addMenuItem({
            path: "browse/member",
            icon: "fa fa-user",
            title: "Клиенты",
            priority: 180,
            action: function() {
                $state.go("workspace.clientsModule")
            },
            permission: "customer:access"
        });
        //$widgetService.registerWidget({
        //    controller: "virtoCommerce.customerModule.memberAccountsWidgetController",
        //    template: "Modules/$(VirtoCommerce.Customer)/Scripts/widgets/memberAccountsWidget.tpl.html"
        //}, "customerDetail1");
        //$widgetService.registerWidget({
        //    controller: "virtoCommerce.customerModule.memberAddressesWidgetController",
        //    template: "Modules/$(VirtoCommerce.Customer)/Scripts/widgets/memberAddressesWidget.tpl.html"
        //}, "customerDetail1");
        //$widgetService.registerWidget({
        //    controller: "virtoCommerce.customerModule.memberEmailsWidgetController",
        //    template: "Modules/$(VirtoCommerce.Customer)/Scripts/widgets/memberEmailsWidget.tpl.html"
        //}, "customerDetail1");
        //$widgetService.registerWidget({
        //    controller: "virtoCommerce.customerModule.memberPhonesWidgetController",
        //    template: "Modules/$(VirtoCommerce.Customer)/Scripts/widgets/memberPhonesWidget.tpl.html"
        //}, "customerDetail2");
        //$widgetService.registerWidget({
        //    controller: "platformWebApp.dynamicPropertyWidgetController",
        //    template: "$(Platform)/Scripts/app/dynamicProperties/widgets/dynamicPropertyWidget.tpl.html"
        //}, "customerDetail2");
        //$widgetService.registerWidget({
        //    controller: "virtoCommerce.customerModule.memberAddressesWidgetController",
        //    template: "Modules/$(VirtoCommerce.Customer)/Scripts/widgets/memberAddressesWidget.tpl.html"
        //}, "organizationDetail1");
        //$widgetService.registerWidget({
        //    controller: "virtoCommerce.customerModule.memberEmailsWidgetController",
        //    template: "Modules/$(VirtoCommerce.Customer)/Scripts/widgets/memberEmailsWidget.tpl.html"
        //}, "organizationDetail1");
        //$widgetService.registerWidget({
        //    controller: "virtoCommerce.customerModule.memberPhonesWidgetController",
        //    template: "Modules/$(VirtoCommerce.Customer)/Scripts/widgets/memberPhonesWidget.tpl.html"
        //}, "organizationDetail1");
        //$widgetService.registerWidget({
        //    controller: "platformWebApp.dynamicPropertyWidgetController",
        //    template: "$(Platform)/Scripts/app/dynamicProperties/widgets/dynamicPropertyWidget.tpl.html"
        //}, "organizationDetail2")
    }]);



