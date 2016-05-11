angular.module('sdl.management')
.controller('sdl.management.clientsListController',
    ['$injector', '$scope', 'sdl.management.clients', 'sdl.management.bladeNavigationService', 'billingTemplatesBase',
        'sdl.management.bladeUtils', 'sdl.management.uiGridHelper',
function ($injector, $scope, clients, bladeNavigationService,  billingTemplatesBase, bladeUtils, uiGridHelper) {
    var settingsTree;
    var blade = $scope.blade;

    $scope.searchType = null;
    $scope.searchTypes = [
        {searchId: 'phone', name: 'clients.blades.member-list.labels.phone'},
        {searchId: 'name', name: 'clients.blades.member-list.labels.name'},
        {searchId: 'lastName', name: 'clients.blades.member-list.labels.lastName'},
        {searchId: 'nPassport', name: 'clients.blades.member-list.labels.nPassport'},
        {searchId: 'nContract', name: 'clients.blades.member-list.labels.nContract'},
        {searchId: 'email', name: 'clients.blades.member-list.labels.email'},
        {searchId: 'nCar', name: 'clients.blades.member-list.labels.nCar'}
    ];
    $scope.selected = { value: $scope.searchTypes[0] };

    blade.refresh = function (disableOpenAnimation) {
        blade.isLoading = true;

        clients.getList().then(function (results) {

            blade.allClients = results;
            blade.isLoading = false;
//console.log(blade.allClients)
            // open previous settings detail blade if possible
            if ($scope.selectedNodeId) {
                $scope.selectNode({ groupName: $scope.selectedNodeId },  disableOpenAnimation);
            }
        },
        function(error) {
             bladeNavigationService.setError('Error ' + error.status, blade);
        });
    };

    $scope.selectNode = function (node, disableOpenAnimation) {
        bladeNavigationService.closeChildrenBlades(blade, function () {
            $scope.selectedNodeId = node.groupName;
            if (node.children) {
                blade.searchText = null;
                $scope.blade.currentEntities = node.children;

                setBreadcrumbs(node);
            } else {
                var selectedClients = _.where(blade.allClients,
                    { groupName: node.groupName });
                var newBlade = {
                    id: 'clientsSection',
                    data: selectedClients,
                    title: 'Детали',
                    disableOpenAnimation: disableOpenAnimation,
                    controller: 'sdl.management.clientsDetailController',
                    template: billingTemplatesBase +
                        'templates/clients/blades/clients-detail.tpl.html'
                };

                bladeNavigationService.showBlade(newBlade, blade);
            }
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
                //generateNewApiAccount();
                var newBlade = {
                    id: 'listItemChild',
                    title: 'clients.blades.member-add.title',
                    subtitle: 'clients.blades.member-add.subtitle',
                    //controller: 'sdl.management.clientCreateController',
                    controller: 'sdl.management.clientsDetailController',
                    template: billingTemplatesBase + 'templates/clients/blades/clients-detail.tpl.html'
                };
                //bladeNavigationService.showBlade(newBlade, blade);
                //var newBlade = {
                //    id: 'clientsSection',
                //    data: selectedClients,
                //    title: 'Детали',
                //    disableOpenAnimation: disableOpenAnimation,
                //    controller: 'sdl.management.clientsDetailController',
                //    template: billingTemplatesBase +
                //    'templates/clients/blades/clients-detail.tpl.html'
                //};
                bladeNavigationService.showBlade(newBlade, blade);
                //bladeNavigationService.closeBlade($scope.blade, function () {
                //    console.log(blade)
                //    bladeNavigationService.showDetailBlade({}, 'clients.blades.new-member.title');
                //});
            },
            canExecuteMethod: function () {
                return true;
            },
            permission: blade.updatePermission
        }
    ];

    //--------------grid------------------
    $scope.uiGridConstants = uiGridHelper.uiGridConstants;
    $scope._registerApi = (gridApi)=>{
        return (gridApi)=>{
            gridApi.infiniteScroll.on.needLoadMoreData($scope, $scope.getDataDown);
            $scope.gridApi = gridApi;
        }
    };

    $scope.getDataDown = function(){
        blade.refresh(function(data) {
            blade.isLoading = false;
            $scope.gridApi.infiniteScroll.saveScrollPercentage();
            $scope.listEntries = $scope.listEntries.concat(data.members);
            $scope.gridApi.infiniteScroll.dataLoaded();

            $scope.pageSettings.totalItems =  $scope.listEntries.length;
        })
    };

    // ui-grid
    $scope.setGridOptions = function (gridOptions) {
        uiGridHelper.initialize($scope, gridOptions, function (gridApi) {
            uiGridHelper.bindRefreshOnSortChanged($scope);
        });
        bladeUtils.initializePagination($scope);
    };
    ///////\grid

    $scope.$watch('blade.searchText', function (newVal) {
        if (newVal) {
            $scope.blade.currentEntities = settingsTree;
            setBreadcrumbs({ groupName: null });
        }
    });

    // actions on load
    blade.refresh();
}]);