angular.module('sdl.management')
.controller('sdl.management.clientsDetailController',
    ['$scope', 'sdl.management.dialogService', 'sdl.management.bladeNavigationService', 'sdl.management.settings',
        'sdl.management.clientsave', 'sdl.management.clientedit', 'sdl.management.cars',
        'sdl.management.subjects', 'sdl.management.regions', 'sdl.management.pointsName', 'billingTemplatesBase',
    function ($scope, dialogService, bladeNavigationService, settings, clients, clientedit, clientcar, subjectsService,
              regionsService, pointsNameService, billingTemplatesBase) {

        var blade = $scope.blade;
        blade.updatePermission = 'module:client:update';

        blade.isLoading = false;

        //get subjects
            subjectsService.list({}, function (data) {
                $scope.subjects = data.subjects;
            });
        ////get regions
            $scope.choseSubject = function(item){
                regionsService.list({}, function(data){
                    $scope.regions = data.regions;
                });
                pointsNameService.list({}, function(data){
                    $scope.pointsName = data.pointsName;
                });
                $scope.typeofPoints = [
                        {"name":"Город"}, {"name":"Деревня"}, {"name":"Поселок городского типа"}, {"name":"Поселок"},
                        {"name":"Сельское поселение"},
                        {"name":"Рабочий поселок"}, {"name":"Село"}, {"name":"Дачный поселок"}, {"name":"Нет"}
                    ];
            }


        function deserialize(data){
            if(data.PhoneNumber){
                data.PhoneNumber = data.PhoneNumber.toString().slice(1);
            }
            if(data.Passport){

                data.Passport.IssueDate = new Date(data.Passport.IssueDate.Month+'.'+data.Passport.IssueDate.Day+ "."+data.Passport.IssueDate.Year);

                function fieldsAddressToJson(fields){
                    let field = ["CityName","Region","Subject"];

                    for (let i in field){
                        fields[field[i]] = fields[field[i]] ? {"name": fields[field[i]]} : '';
                    }
                }
                if(data.Passport.Address){
                    fieldsAddressToJson(data.Passport.Address)

                }
                if(data.PostAddress){
                    fieldsAddressToJson(data.PostAddress)
                }

            }
            console.log('deserialize',data)
            return data;
        }

        blade.refresh = function () {
            //console.log('blade.moduleId=',blade.moduleId)
            //if (blade.moduleId) {
            //    blade.isLoading = true;
            //
            //    settings.getSettings({ id: blade.moduleId }, initializeBlade,
            //    function (error) {
            //        bladeNavigationService.setError('Error ' + error.status, blade);
            //    });
            //} else {

                initializeBlade(angular.copy(blade.data));
            //}
        }


    function initializeBlade(results) {
        settings.fixValues(results);

        //_.each(results, function (setting) {
        //    // set group names to show.
        //    //if (setting.groupName) {
        //    //    var paths = setting.groupName.split('|');
        //    //    setting.groupName = paths.pop();
        //    //}
        //
        //    // transform to va-generic-value-input suitable structure
        //    setting.isDictionary = _.any(setting.allowedValues);
        //    setting.values = setting.isDictionary ? [{ value: { id: setting.value, name: setting.value } }] : [{ id: setting.value, value: setting.value }];
        //    if (setting.allowedValues) {
        //        setting.allowedValues = _.map(setting.allowedValues, function (x) {
        //            return { id: x, name: x };
        //        });
        //    }
        //});
        //results = _.groupBy(results, 'groupName');
        //blade.groupNames = _.keys(results);

        blade.isLoading = false;

        if(results == undefined) { // new
            blade.currentEntity = {};
            blade.origEntity = {};
            $scope.PostAddressCheck = true;

        }else{ // edit
            deserialize(results);
            blade.currentEntity = angular.copy(results);
            blade.origEntity = results;
            $scope.PostAddressCheck = !blade.currentEntity.PostAddress.Subject.name;
        }
    }

    //$scope.editArray = function (node) {
    //    var newBlade = {
    //        id: "settingDetailChild",
    //        currentEntityId: node.name,
    //        controller: 'sdl.management.settingDictionaryController',
    //        template: 'templates/settings/blades/setting-dictionary.tpl.html'
    //    };
    //    bladeNavigationService.showBlade(newBlade, blade);
    //}

    var formScope = {};
    $scope.setForm = function (form) { formScope = form; };

    function isDirty() {
        return !angular.equals(blade.currentEntity, blade.origEntity) && blade.hasUpdatePermission();
    }

    function canSave() {
        return isDirty() && formScope && formScope.$valid;
    }


    function serialize (entities){

        let currentEntities = serialize_select (entities);

	    currentEntities.PhoneNumber = '7' + currentEntities.PhoneNumber;


        if($scope.PostAddressCheck && currentEntities.Passport && currentEntities.Passport.Address){
            currentEntities.PostAddress = currentEntities.Passport.Address;
        }

        if(currentEntities.Passport && currentEntities.Passport.IssueDate){
            let date = currentEntities.Passport.IssueDate;
            currentEntities.Passport.IssueDate = {
                "Year": date.getFullYear(),
                "Month": date.getMonth(),
                "Day": date.getDay()
            }
        }
        if(currentEntities.Passport && currentEntities.Passport.Address){
            currentEntities.Passport.Address.Country = "RF";
        }
        return currentEntities;
    }
    function serialize_select (entities){
        for (let pr in entities) {
            if(typeof entities[pr] === 'object'){
            //    console.log('entities[pr]',entities[pr]);
                if(entities[pr] && (entities[pr].name != undefined)){
                    entities[pr] = entities[pr].name;
                }else{
                    entities[pr] = serialize_select (entities[pr])
                }
            }
        }
        return entities;
    }

    function saveChanges() {
        blade.isLoading = true;

        let currentEntities = serialize(angular.copy(blade.currentEntity));

        if(currentEntities.Id){ // edit exited
            clientedit.list(currentEntities, function(data){
                blade.isLoading = false;
                blade.error = '';
                blade.origEntity = blade.currentEntity;
                blade.parentBlade.refresh(true);
                closeBlade();
            },function(err){
                blade.isLoading = false;
                console.log(err.data)
                blade.error = (err.data)?err.data[Object.keys( err.data )[0]][0]:'';
            });
        }else{// add new
            clients.list(currentEntities, function(data){
                blade.isLoading = false;
                blade.error = '';
                blade.origEntity = blade.currentEntity;
                blade.parentBlade.refresh(true);
                closeBlade();
            },function(err){
                blade.isLoading = false;
                blade.error = (err.data)?err.data[Object.keys( err.data )[0]][0]:'';
            });
        }


        //clients.one()
        //    .customPUT(currentEntities).then(function (results) {
        //    console.log(results)
        //});
        //var objects = _.flatten(_.map(blade.currentEntity, _.values));
        //
      //  console.log('blade.currentEntity',blade.currentEntity)

        //objects = _.map(objects, function (x) {
        //    x.value = x.isDictionary ? x.values[0].value.id : x.values[0].value;
        //    x.values = undefined;
        //    return x;
        //});
        //
        //var selectedSettings = _.where(objects, { isArray: true });
        //_.forEach(selectedSettings, function (setting) {
        //    if (setting.arrayValues) {
        //        setting.arrayValues = _.pluck(setting.arrayValues, 'value');
        //    }
        //});

        //console.log('saveChanges3: ' + angular.toJson(objects, true));
        //settings.update({}, objects, function (data, headers) {
        //    if (blade.moduleId) {
        //        blade.refresh();
        //    } else {
        //        blade.origEntity = blade.currentEntity;
        //        blade.parentBlade.refresh(true);
        //    }
        //}, function (error) {
        //    bladeNavigationService.setError('Error ' + error.status, blade);
        //});
    };

    let closeBlade = function(){
        bladeNavigationService.closeBlade(blade, '', function () {
            let blade = $('.blade:last', $('.cnt'));
            blade.addClass('__animate').animate({ 'margin-left': '-' + blade.width() + 'px' }, 145, function () {
                blade.remove();
            });
        });
    };

    blade.headIcon = 'fa-wrench';
    blade.toolbarCommands = [
        {
            name: "platform.commands.save",
            icon: 'fa fa-save',
            executeMethod: saveChanges,
            canExecuteMethod: canSave //function(){return true}
        },
        {
            name: "platform.commands.reset",
            icon: 'fa fa-eraser',
            executeMethod: function () {
                blade.currentEntity = angular.copy(blade.origEntity);
            },
            canExecuteMethod: isDirty
        },
        {
            name: "platform.commands.undo",
            icon: 'fa fa-undo',
            executeMethod: () =>{
                angular.copy(blade.origEntity, blade.currentEntity);
                closeBlade();
            },
            canExecuteMethod: isDirty,
            permission: blade.updatePermission
        },
        {
            name: "platform.commands.car",
            icon: 'fa fa-car',
            executeMethod: () =>{
                clientcar.list({id:blade.currentEntity.Id},function(data){
                    console.log(data)

                },function(){
                    var cars = {
                        id: 'listItemChild',
                        data: {clientId:blade.currentEntity.Id},
                        title: 'clients.blades.car-list.title',
                        controller: 'sdl.management.carsListCtrl',
                        template: billingTemplatesBase + 'templates/cars/blades/car-list.tpl.html'
                    };
                    bladeNavigationService.showBlade(cars, blade);
                });
            },
            canExecuteMethod: function(){return true},
            permission: blade.updatePermission
        }

    ];
    
    blade.onClose = function (closeCallback) {
        bladeNavigationService.showConfirmationIfNeeded(isDirty(), canSave(), blade, saveChanges, closeCallback, "platform.dialogs.settings-delete.title", "platform.dialogs.settings-delete.message");
    };

    $scope.getDictionaryValues = function (setting, callback) {
        callback(setting.allowedValues);
    }

     {
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

        $scope.format = 'dd.MM.yy';

    }

    // actions on load
    blade.refresh();
}]);
