angular.module('sdl.management')
.controller('sdl.management.memberPhonesWidgetController', ['$scope', 'platformWebApp.bladeNavigationService',
    function ($scope, bladeNavigationService) {

    $scope.blade = $scope.widget.blade;

    $scope.openBlade = function () {
        var newBlade = {
            id: "customerChildBlade",
            title: $scope.blade.title,
            subtitle: 'client.widgets.member-phones-list.blade-subtitle',
            controller: 'sdl.management.memberPhonesListController',
            template: 'Modules/$(VirtoCommerce.Customer)/Scripts/blades/member-phones-list.tpl.html'
        };
        bladeNavigationService.showBlade(newBlade, $scope.blade);
    };
}]);