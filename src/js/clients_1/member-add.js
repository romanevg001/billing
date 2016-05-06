angular.module('sdl.clientsModule')
.controller('clientsModule.memberAddController', ['$scope', 'sdl.management.bladeNavigationService', function ($scope, bladeNavigationService) {
    var pb = $scope.blade.parentBlade;

    //$scope.addOrganization = function () {
    //    bladeNavigationService.closeBlade($scope.blade, function () {
    //        pb.showDetailBlade({ memberType: 'Organization' }, 'customer.blades.new-organization.title');
    //    });
    //};

    //$scope.addCustomer = function () {
        bladeNavigationService.closeBlade($scope.blade, function () {
            pb.showDetailBlade({}, 'clients.blades.new-member.title');
        });
    //};

    $scope.blade.isLoading = false;
}]);
