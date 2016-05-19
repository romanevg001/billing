angular.module('sdl.management')
.controller('sdl.management.clientsListController',
    ['$injector', '$scope', 'sdl.management.clients', 'sdl.management.bladeNavigationService', 'billingTemplatesBase',
        'sdl.management.bladeUtils', 'sdl.management.uiGridHelper', '$localStorage',
function ($injector, $scope, clients, bladeNavigationService,  billingTemplatesBase, bladeUtils, uiGridHelper, $localStorage) {
    var settingsTree;
    var blade = $scope.blade;

    $scope.opts = {
        currentPage: 1,
        countClients: 10
    };

    var paramRequest = {};

    $scope.searchTypes = [
        {searchId: "Phone", name: "clients.blades.member-list.labels.phone"},
        {searchId: "FirstName", name: "clients.blades.member-list.labels.name"},
        {searchId: "LastName", name: "clients.blades.member-list.labels.lastName"},
        {searchId: "PassportNumber", name: "clients.blades.member-list.labels.nPassport"},
        {searchId: "ContractNumber", name: "clients.blades.member-list.labels.nContract"},
        {searchId: "EMail", name: "clients.blades.member-list.labels.email"},
        {searchId: "VehicleNumber", name: "clients.blades.member-list.labels.nCar"}
    ];
    blade.currentEntity = {}.searchTypes = {};



    function deserialize(data){
        _.each(data, function (dt) {
            if(dt.PhoneNumber){
                dt.PhoneNumberString = dt.PhoneNumber.toString().slice(1);
            }
        });
        return data;
    }

    blade.refresh = function (disableOpenAnimation) {

        blade.isLoading = true;

        paramRequest.take= $scope.opts.countClients * $scope.opts.currentPage;

        clients.getList(paramRequest).then(function (results) {

            blade.allClients = deserialize(results);
            blade.isLoading = false;

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
        bladeNavigationService.closeChildrenBlades(blade, function(){

                let clientId = node.Id;
                var selectedClient = _.where(blade.allClients, { Id: clientId })[0];
//console.log('blade=',blade);

                $localStorage["clients_" + clientId]  = selectedClient;


                var newBlade = {
                    id: 'clientsSection',
                    data: selectedClient,
                    title: 'clients.blades.member-detail.title',
                    disableOpenAnimation: disableOpenAnimation,
                    controller: 'sdl.management.clientsDetailController',
                    template: billingTemplatesBase + 'templates/clients/blades/clients-detail.tpl.html'
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
            $scope.gridApi.infiniteScroll.saveScrollPercentage();
            blade.allClients =  blade.allClients.concat(data);
            $scope.gridApi.infiniteScroll.dataLoaded();
            $scope.pageSettings.totalItems =  $scope.listEntries.length;
        })
    };

    $scope.$watch('blade.searchText', function (newVal) {
        if (newVal) {
            if(blade.currentEntity.searchTypes){
                paramRequest[blade.currentEntity.searchTypes.searchId] = newVal;
            }else{
                paramRequest.keyword = newVal;
            }

            blade.refresh(function(data) {
                blade.isLoading = false;
                blade.allClients =  data;
            });
            //$scope.blade.currentEntities = settingsTree;
            //setBreadcrumbs({ groupName: null });
        }
    });

    $scope.selectSearchType = function(item){
        paramRequest = {};
        if(blade.searchText) {
            paramRequest[item.searchId] = blade.searchText;

            blade.refresh(function (data) {
                blade.isLoading = false;
                blade.allClients = data;
            });
        }else{
            return false;
        }
    };

    $scope.sort= function sort (column) {

        if(!$scope.sortDirect) $scope.sortDirect={};

        if(sort[column] == 'desc'){
            paramRequest.sort = '-'+column;
            $scope.sortDirect[column] = 'desc';

            sort[column] = 'asc';
        }else{
            paramRequest.sort = column;
            $scope.sortDirect[column] = 'asc';

            sort[column] = 'desc';
        }



        blade.refresh(function(data) {
            blade.isLoading = false;
            blade.allClients =  data;
        })
    };

    // actions on load
    blade.refresh();
}]);