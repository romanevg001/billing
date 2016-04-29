angular.module('sdl.clientsModule')
.controller('clientsModule.memberDetailController', ['$scope', 'sdl.management.bladeNavigationService',
    //'clientsModule.contacts', //'virtoCommerce.customerModule.organizations',
    'clientsModule.member', 'clientsModule.subjects', 'clientsModule.regions', 'clientsModule.pointsName',
    function ($scope, bladeNavigationService, member, subjects, regions, pointsName) {

    var blade = $scope.blade;
    blade.updatePermission = 'customer:update';
    blade.currentResource = '';//contacts;//blade.isOrganization ? organizations : contacts;
    blade.isLoading = false;

    blade.refresh = function (parentRefresh) {
        if (blade.currentEntityId) {
            blade.isLoading = true;
            blade.currentResource.get({ _id: blade.currentEntityId }, function (data) {
                initializeBlade(data);
                if (parentRefresh) {
                    blade.parentBlade.refresh();
                }
            },
            function (error) { bladeNavigationService.setError('Error ' + error.status, blade); });
        } else {
            var newEntity = {
                dynamicProperties: [],
                addresses: [],
                phones: [],
                emails: []
            };

            //if (blade.isOrganization) {
            //    newEntity.parentId = blade.parentBlade.currentEntity.id;
            ////    fillDynamicProperties(newEntity, 'VirtoCommerce.Domain.Customer.Model.Organization');
            //} else {
            //    newEntity.organizations = [];
            //    if (blade.parentBlade.currentEntity.id) {
            //        newEntity.organizations.push(blade.parentBlade.currentEntity.id);
            //    }
            ////    fillDynamicProperties(newEntity, 'VirtoCommerce.Domain.Customer.Model.Contact');
            //}
        }
    }

    $scope.subjects = '';
    $scope.regions = '';
    $scope.typeofPoints = '';
    $scope.pointsName = '';

    //get subjects
    subjects.list({},function(data){
        $scope.subjects = data.subjects;
    });

    //get regions
    $scope.choseSubject = function(item){
        regions.list({}, function(data){
            $scope.regions = data.regions;
        });
    }

    //get regions
    $scope.choseRegion = function(item){
        $scope.typeofPoints = [
            {"name":"Город"}, {"name":"Деревня"}, {"name":"Поселок городского типа"}, {"name":"Поселок"},
            {"name":"Сельское поселение"},
            {"name":"Рабочий поселок"}, {"name":"Село"}, {"name":"Дачный поселок"}, {"name":"Нет"}
        ];

        pointsName.list({}, function(data){
            $scope.pointsName = data.pointsName;
        });
    }








    function fillDynamicProperties(newEntity, typeName) {
    //    console.log('boom')
        member.query({ id: 0 }, function (results) {
        //    _.each(results, function (x) {
        //        x.displayNames = undefined;
        //        x.values = [];
        //    });
        //    newEntity.dynamicProperties = results;
            console.log(results.members[0]);
            initializeBlade(results.members[0]);
        }, function (error) { bladeNavigationService.setError('Error ' + error.status, blade); });
    }

    function initializeBlade(data) {
        blade.currentEntity = angular.copy(data);
        blade.origEntity = data;
        blade.isLoading = false;
    }

    function isDirty() {
        return !angular.equals(blade.currentEntity, blade.origEntity) && blade.hasUpdatePermission();
    }

    function canSave() {
        return isDirty() && $scope.formScope && $scope.formScope.$valid;
    }

    $scope.saveChanges = function () {

        blade.isLoading = true;

        if (blade.currentEntityId) {
            blade.currentResource.update({}, blade.currentEntity, function (data) {
                blade.refresh(true);
            }, function (error) {
                bladeNavigationService.setError('Error ' + error.status, blade);
            });
        } else {
            blade.currentResource.save({}, blade.currentEntity, function (data) {
                blade.title = data.name;
                blade.currentEntityId = data.id;
                initializeBlade(data);
                blade.parentBlade.refresh();
            }, function (error) {
                bladeNavigationService.setError('Error ' + error.status, blade);
            });
        }
    };

    $scope.setForm = function (form) {
        $scope.formScope = form;
    }

    blade.onClose = function (closeCallback) {
        bladeNavigationService.showConfirmationIfNeeded(isDirty(), canSave(), blade,
            $scope.saveChanges, closeCallback, "clients.dialogs.customer-save.title", "customer.dialogs.customer-save.message");
    };

    blade.headIcon = blade.isOrganization ? 'fa fa-university' : 'fa fa-user';
    blade.toolbarCommands = [
        {
            name: "platform.commands.save",
            icon: 'fa fa-save',
            executeMethod: $scope.saveChanges,
            canExecuteMethod: canSave,
            permission: blade.updatePermission
        },
        {
            name: "platform.commands.reset",
            icon: 'fa fa-undo',
            executeMethod: function () {
                angular.copy(blade.origEntity, blade.currentEntity);
            },
            canExecuteMethod: isDirty,
            permission: blade.updatePermission
        }
    ];

    // datepicker
    $scope.datepickers = {
        bd: false
    }
    $scope.today = new Date();

    $scope.open = function ($event, which) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.datepickers[which] = true;
    };

    $scope.dateOptions = {
        'year-format': "'yyyy'",
        'starting-day': 1
    };

    $scope.formats = ['shortDate', 'dd-MMMM-yyyy', 'yyyy/MM/dd'];
    $scope.format = $scope.formats[0];

    // other on load
    //if (!blade.isOrganization) {
    //    //$scope.organizations = organizations.query();
    //}

    blade.refresh(false);
}]);