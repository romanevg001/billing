angular.module('sdl.management')
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

            //$scope.selectedNodeId = node.groupName;
            //
            //console.log(node);
            //
            //if (node.children) {
            //    //blade.searchText = null;
            //    $scope.blade.currentEntities = node.children;
            //    setBreadcrumbs(node);
            //
            //} else {
                var selectedCars = _.where(blade.allCars, { Id: node.Id })[0];
                    selectedCars.clientId = blade.data.clientId;
            console.log('selectedCars===>',selectedCars)
                var newBlade = {
                    id: 'carsSection',
                    data: selectedCars,
                    title: 'clients.blades.car-detail.title',
                    disableOpenAnimation: disableOpenAnimation,
                    controller: 'sdl.management.carDetailCtrl',
                    template: billingTemplatesBase + 'templates/cars/blades/car-detail.tpl.html'
                };

                bladeNavigationService.showBlade(newBlade, blade);
            //}
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

    blade.headIcon = 'fa-users';

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
    $scope.uiGridConstants = uiGridHelper.uiGridConstants;

    // ui-grid
    $scope.setGridOptions = function (gridOptions) {
        uiGridHelper.initialize($scope, gridOptions, function (gridApi) {
            uiGridHelper.bindRefreshOnSortChanged($scope);
        });
        bladeUtils.initializePagination($scope);
    };
    ///////\grid
    $scope.loadMore = function(){
        $scope.opts.currentPage += 1;

        blade.refresh(function(data) {
            blade.isLoading = false;
            //$scope.gridApi.infiniteScroll.saveScrollPercentage();
            blade.allCars =  blade.allCars.concat(data);
            //$scope.gridApi.infiniteScroll.dataLoaded();
            //$scope.pageSettings.totalItems =  $scope.listEntries.length;
        })
    };

    //$scope.$watch('blade.searchText', function (newVal) {
    //    if (newVal) {
    //        if(blade.currentEntity.searchTypes){
    //            paramRequest[blade.currentEntity.searchTypes.searchId] = newVal;
    //        }else{
    //            paramRequest.keyword = newVal;
    //        }
    //
    //        blade.refresh(function(data) {
    //            blade.isLoading = false;
    //            blade.allClients =  data;
    //        });
    //        //$scope.blade.currentEntities = settingsTree;
    //        //setBreadcrumbs({ groupName: null });
    //    }
    //});

    //$scope.selectSearchType = function(item){
    //    paramRequest = {};
    //    if(blade.searchText) {
    //        paramRequest[item.searchId] = blade.searchText;
    //
    //        blade.refresh(function (data) {
    //            blade.isLoading = false;
    //            blade.allClients = data;
    //        });
    //    }else{
    //        return false;
    //    }
    //};

    //$scope.sort= function sort (column) {
    //
    //    if(!$scope.sortDirect) $scope.sortDirect={};
    //
    //    if(sort[column] == 'desc'){
    //        paramRequest.sort = '-'+column;
    //        $scope.sortDirect[column] = 'desc';
    //
    //        sort[column] = 'asc';
    //    }else{
    //        paramRequest.sort = column;
    //        $scope.sortDirect[column] = 'asc';
    //
    //        sort[column] = 'desc';
    //    }
    //
    //
    //
    //    blade.refresh(function(data) {
    //        blade.isLoading = false;
    //        blade.allClients =  data;
    //    })
    //};

    // actions on load
    blade.refresh();
}]);