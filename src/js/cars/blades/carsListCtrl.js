﻿angular.module('sdl.management')
.controller('sdl.management.carsListCtrl',
    ['$injector', '$scope', 'sdl.management.clients', 'sdl.management.bladeNavigationService', 'billingTemplatesBase',
        'sdl.management.bladeUtils', 'sdl.management.uiGridHelper', 'sdl.management.cars',
function ($injector, $scope, clients, bladeNavigationService,  billingTemplatesBase,
          bladeUtils, uiGridHelper, cars) {
    var settingsTree;
    var blade = $scope.blade;

    blade.isLoading = false;
    $scope.opts = {
        currentPage: 1,
        countCars: 10
    };

    var paramRequest = {};

    blade.refresh = function (disableOpenAnimation) {

        blade.isLoading = true;

        paramRequest.take = $scope.opts.countCars * $scope.opts.currentPage;
        paramRequest.Id = blade.data.clientId;

        cars.list(paramRequest,function(result){
            blade.allCars = result.Data;
            blade.isLoading = false;
        })

    };

    $scope.selectNode = function (node, disableOpenAnimation) {
        bladeNavigationService.closeChildrenBlades(blade, function(){

            var selectedCars = _.where(blade.allCars, { Id: node.Id })[0];
                selectedCars.clientId = blade.data.clientId;

            var newBlade = {
                id: 'carsSection',
                data: selectedCars,
                title: 'clients.blades.car-detail.title',
                disableOpenAnimation: disableOpenAnimation,
                controller: 'sdl.management.carDetailCtrl',
                template: billingTemplatesBase + 'templates/cars/blades/car-detail.tpl.html'
            };

            bladeNavigationService.showBlade(newBlade, blade);

        });
    };

    //Breadcrumbs
    function setBreadcrumbs(node) {
        blade.breadcrumbs.splice(1, blade.breadcrumbs.length - 1);

        if (node.groupName) {
            var lastParentId = '';
            var lastchildren = settingsTree;
            var paths = node.groupName.split('|');
            _.each(paths, function (path) {
                lastchildren = lastchildren[path].children;
                lastParentId += '|' + path;
                var breadCrumb = {
                    id: lastParentId.substring(1),
                    name: path,
                    children: lastchildren,
                    navigate: function () {
                        $scope.selectNode({ groupName: this.id, children: this.children });
                    }
                };

                blade.breadcrumbs.push(breadCrumb);
            });
        }
    }

    blade.breadcrumbs = [{
        id: null,
        name: "platform.navigation.bread-crumb-top",
        navigate: function () {
            $scope.selectNode({ groupName: null, children: settingsTree });
        }
    }];

    blade.headIcon = 'fa-car';

    blade.toolbarCommands = [
        {
            name: "platform.commands.add", icon: 'fa fa-plus',
            executeMethod: function () {

                var newBlade = {
                    id: 'listItemCars',
                    data:{"clientId":blade.data.clientId},
                    title: 'clients.blades.car-add.title',
                    controller: 'sdl.management.carDetailCtrl',
                    template: billingTemplatesBase + 'templates/cars/blades/car-detail.tpl.html'
                };

                bladeNavigationService.showBlade(newBlade, blade);

            },
            canExecuteMethod: function () {
                return true;
            },
            permission: blade.updatePermission
        }
    ];

    //--------------grid------------------
    //$scope.uiGridConstants = uiGridHelper.uiGridConstants;
    //
    //// ui-grid
    //$scope.setGridOptions = function (gridOptions) {
    //    uiGridHelper.initialize($scope, gridOptions, function (gridApi) {
    //        uiGridHelper.bindRefreshOnSortChanged($scope);
    //    });
    //    bladeUtils.initializePagination($scope);
    //};
    ///////\grid
    $scope.loadMore = function(){
        $scope.opts.currentPage += 1;

        blade.refresh(function(data) {
            blade.isLoading = false;
            blade.allCars =  blade.allCars.concat(data);
        })
    };

    // actions on load
    blade.refresh();
}]);