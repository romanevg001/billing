//'virtoCommerce.customerModule.contacts', 'virtoCommerce.customerModule.organizations',

angular.module('sdl.clientsModule')
.controller('clientsModule.memberListController', ['$scope', 'clientsModule.members','sdl.management.dialogService',
    'sdl.management.bladeUtils', 'sdl.management.uiGridHelper',
    function ($scope, members, dialogService, bladeUtils, uiGridHelper) {
        //, contacts, organizations,
        $scope.uiGridConstants = uiGridHelper.uiGridConstants;

        var blade = $scope.blade;
        blade.title = 'clients.blades.member-list.title';

        var bladeNavigationService = bladeUtils.bladeNavigationService;

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

        $scope.choseSearchTypes = function(item){
            $scope.searchType = item.searchId;
        };


        blade.refresh = function (callback) {
            blade.isLoading = true;

            callback = (typeof callback) === 'function' ? callback : false;

            members.search(
                {
                    memberId: blade.currentEntity.id,
                    keyword: filter.keyword ? filter.keyword : undefined,
                    sort: uiGridHelper.getSortExpression($scope),
                    skip: ($scope.pageSettings.currentPage - 1) * $scope.pageSettings.itemsPerPageCount,
                    take: $scope.pageSettings.itemsPerPageCount,
                    group: $scope.searchType
                },
                callback || function (data) {
                    blade.isLoading = false;
                    $scope.pageSettings.totalItems = data.totalCount;

                    $scope.listEntries = data.members;

                    //Set navigation breadcrumbs
                    setBreadcrumbs();
                }, function (error) {
                    bladeNavigationService.setError('Error ' + error.status, blade);
                });
        };

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

        //Breadcrumbs
        function setBreadcrumbs() {
            if (blade.breadcrumbs) {
                //Clone array (angular.copy leaves the same reference)
                var breadcrumbs = blade.breadcrumbs.slice(0);

                //prevent duplicate items
                if (_.all(breadcrumbs, function (x) { return x.id !== blade.currentEntity.id; })) {
                    var breadCrumb = generateBreadcrumb(blade.currentEntity.id, blade.currentEntity.name);
                    breadcrumbs.push(breadCrumb);
                }
                blade.breadcrumbs = breadcrumbs;
            } else {
                blade.breadcrumbs = [generateBreadcrumb(null, 'all')];
            }
        }

        function generateBreadcrumb(id, name) {
            return {
                id: id,
                name: name,
                blade: blade,
                navigate: function (breadcrumb) {
                    //bladeNavigationService.closeBlade(breadcrumb.blade,
                    //function () {
                    breadcrumb.blade.disableOpenAnimation = true;
                    bladeNavigationService.showBlade(breadcrumb.blade);
                    breadcrumb.blade.refresh();
                    //});
                }
            }
        }

        $scope.getMainAddress = function (data) {
            var retVal;
            if (_.some(data.addresses)) {
                var primaries = _.where(data.addresses, { Primary: "Primary" });
                if (_.some(primaries)) {
                    retVal = primaries[0];
                } else {
                    primaries = _.where(data.addresses, { name: "Primary Address" });
                    if (_.some(primaries)) {
                        retVal = primaries[0];
                    } else {
                        retVal = data.addresses[0];
                    }
                }
            }
            return retVal ? (retVal.line1 + ' ' + retVal.city + ' ' + retVal.countryName) : '';
        }

        $scope.getMainEmail = function (data) {
            var retVal;
            if (_.some(data.emails)) {
                retVal = data.emails[0];
            }
            return retVal;
        }

        blade.showDetailBlade = function (listItem, title) {
            blade.setSelectedNode(listItem);

            var newBlade = {
                id: "listMemberDetail",
                currentEntityId: listItem.id,
                isOrganization: false,
                title: title,
                subtitle: 'clients.blades.member-detail.subtitle',
                controller: 'clientsModule.memberDetailController',
                template: 'templates/clients/member-detail.tpl.html'
            };

            //if (listItem.memberType === 'Organization') {
            //    newBlade.isOrganization = true;
            //    newBlade.subtitle = 'customer.blades.organization-detail.subtitle';
            //    newBlade.template = 'Modules/$(VirtoCommerce.Customer)/Scripts/blades/organization-detail.tpl.html';
            //}

            bladeNavigationService.showBlade(newBlade, blade);
        };

        $scope.delete = function (data) {
            deleteList([data]);
        };

        function deleteList(selection) {
            var dialog = {
                id: "confirmDeleteItem",
                title: "customer.dialogs.organizations-delete.title",
                message: "customer.dialogs.organizations-delete.message",
                callback: function (remove) {
                    if (remove) {
                        bladeNavigationService.closeChildrenBlades(blade, function () {
                            var organizationIds = _.pluck(_.where(selection, { memberType: 'Organization' }), 'id');
                            var customerIds = _.pluck(_.where(selection, { memberType: 'Contact' }), 'id');

                            if (_.any(organizationIds)) {
                                //organizations.remove({ ids: organizationIds },
                                //blade.refresh,
                                //function (error) { bladeNavigationService.setError('Error ' + error.status, blade); });
                            }
                            if (_.any(customerIds)) {
                                //contacts.remove({ ids: customerIds },
                                //blade.refresh,
                                //function (error) { bladeNavigationService.setError('Error ' + error.status, blade); });
                            }
                        });
                    }
                }
            }
            dialogService.showConfirmationDialog(dialog);
        }

        blade.setSelectedNode = function (listItem) {
            $scope.selectedNodeId = listItem.id;
        };

        $scope.selectNode = function (listItem) {
            blade.setSelectedNode(listItem);

            //if (listItem.memberType === 'Organization') {
            //    var newBlade = {
            //        id: 'memberList',
            //        breadcrumbs: blade.breadcrumbs,
            //        subtitle: 'customer.blades.member-list.subtitle',
            //        subtitleValues: { name: listItem.name },
            //        currentEntity: listItem,
            //        disableOpenAnimation: true,
            //        controller: blade.controller,
            //        template: blade.template,
            //        isClosingDisabled: true
            //    };
            //    bladeNavigationService.showBlade(newBlade, blade.parentBlade);
            //} else {
                blade.showDetailBlade(listItem, listItem.name);
            //}
        };

        blade.headIcon = 'fa-user';

        blade.toolbarCommands = [
            {
                name: "platform.commands.refresh", icon: 'fa fa-refresh',
                executeMethod: blade.refresh,
                canExecuteMethod: function () {
                    return true;
                }
            },
            {
                name: "platform.commands.create", icon: 'fa fa-plus',
                executeMethod: function () {
                    var newBlade = {
                        id: 'listItemChild',
                        title: 'customer.blades.member-add.title',
                        subtitle: 'customer.blades.member-add.subtitle',
                        controller: 'clientsModule.memberAddController',
                        template: 'templates/clients/member-add.tpl.html'
                    };
                    bladeNavigationService.showBlade(newBlade, blade);
                },
                canExecuteMethod: function () {
                    return true;
                },
                permission: 'customer:create'
            //},
            //{
            //    name: "platform.commands.delete", icon: 'fa fa-trash-o',
            //    executeMethod: function () { deleteList($scope.gridApi.selection.getSelectedRows()); },
            //    canExecuteMethod: function () {
            //        return $scope.gridApi && _.any($scope.gridApi.selection.getSelectedRows());
            //    },
            //    permission: 'customer:delete'
            }
        ];


        // simple and advanced filtering
        var filter = $scope.filter = {};

        filter.criteriaChanged = function () {
            if ($scope.pageSettings.currentPage > 1) {
                $scope.pageSettings.currentPage = 1;
            } else {
                blade.refresh();
            }
        };

        //function showFilterDetailBlade(bladeData) {
        //    var newBlade = {
        //        id: 'filterDetail',
        //        controller: 'virtoCommerce.customerModule.filterDetailController',
        //        template: 'Modules/$(VirtoCommerce.Customer)/Scripts/blades/filter-detail.tpl.html',
        //    };
        //    angular.extend(newBlade, bladeData);
        //    bladeNavigationService.showBlade(newBlade, blade);
        //};


        // ui-grid
        $scope.setGridOptions = function (gridOptions) {
            uiGridHelper.initialize($scope, gridOptions, function (gridApi) {
                uiGridHelper.bindRefreshOnSortChanged($scope);
            });
            bladeUtils.initializePagination($scope);
        };


        //No need to call this because page 'pageSettings.currentPage' is watched!!! It would trigger subsequent duplicated req...
        //blade.refresh();
    }]);
