angular.module('sdl.management')
.controller('sdl.management.clientsDetailController',
    ['$scope', 'sdl.management.dialogService', 'sdl.management.bladeNavigationService', 'sdl.management.settings',
        'sdl.management.clientsave',
        'sdl.management.subjects', 'sdl.management.regions', 'sdl.management.pointsName',
    function ($scope, dialogService, bladeNavigationService, settings, clients, subjectsService, regionsService, pointsNameService) {

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
        }
    ////get regions
        $scope.choseRegion = function(item){
            //$scope.typeofPoints = [
            //    {"name":"Город"}, {"name":"Деревня"}, {"name":"Поселок городского типа"}, {"name":"Поселок"},
            //    {"name":"Сельское поселение"},
            //    {"name":"Рабочий поселок"}, {"name":"Село"}, {"name":"Дачный поселок"}, {"name":"Нет"}
            //];

            pointsNameService.list({}, function(data){
                $scope.pointsName = data.pointsName;
            });
        }

console.log(blade.data)
    blade.refresh = function () {
        console.log(blade.moduleId)
        if (blade.moduleId) {
            blade.isLoading = true;

            settings.getSettings({ id: blade.moduleId }, initializeBlade,
            function (error) {
                bladeNavigationService.setError('Error ' + error.status, blade);
            });
        } else {
            initializeBlade(angular.copy(blade.data));
        }
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


        if(results == undefined) {
            blade.currentEntity = {};
            blade.origEntity = {};
            blade.currentEntity.PostAddressCheck = true;
        }else{
            blade.currentEntity = angular.copy(results);
            blade.origEntity = results;

        }


    }

    $scope.editArray = function (node) {
        var newBlade = {
            id: "settingDetailChild",
            currentEntityId: node.name,
            controller: 'sdl.management.settingDictionaryController',
            template: 'templates/settings/blades/setting-dictionary.tpl.html'
        };
        bladeNavigationService.showBlade(newBlade, blade);
    }

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
        //currentEntities.Id = 0;
	    currentEntities.PhoneNumber = '7' + currentEntities.PhoneNumber;
        //currentEntities.Passport = {}.Address = {};
        //console.log(currentEntities)
        //currentEntities.Passport.Address['StreetType'] = "Street";
        //currentEntities.Passport.Address['CityType'] = 'City';
        //currentEntities.Passport.Address['Country'] = 'RF';
        //currentEntities.Passport.Address.Id = 0;

        if(currentEntities.PostAddressCheck){
            currentEntities.PostAddress = currentEntities.Passport.Address;
       //     delete currentEntities.PostAddressCheck;
        }

        if(currentEntities.Passport.IssueDate){
            let date = currentEntities.Passport.IssueDate;
            currentEntities.Passport.IssueDate = {
                "Year": date.getFullYear(),
                "Month": date.getMonth(),
                "Day": date.getDay()
            }
        }
        return currentEntities;
    }
    function serialize_select (entities){
        for (let pr in entities) {
            if(typeof entities[pr] === 'object'){
                if(entities[pr].name != undefined){
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

console.log(currentEntities)
        //let currentEntities ={
        //    "FirstName": "Оля",
        //    "SecondName": "Неоля",
        //    "LastName": "Бахрушина",
        //    "Passport": {
        //        "Emitent": "ОВД Ростова",
        //        "EmitentCode": "09342",
        //        "Number": "346543",
        //        "Seria": "3456",
        //        "Address": {
        //            "Country": "RF",
        //            "CityName": "Ростов-на-Дону"
        //
        //        },
        //        "IssueDate": {
        //            "Year": 2014,
        //                "Month": 4,
        //                "Day": 1
        //        }
        //    },
        //    "PostAddress": {
        //        "Country": "RF"
        //    },
        //
        //    "Email": "sfdsdf@sdf.fg",
        //    "phoneNumber": 79885753774,
        //    "SecretWord": "secret"
        //}


        Comment
            :
            "dfgfdgdfgdfg"
        Email
            :
            "sfdf@dfds.yu"
        FirstName
            :
            "dfg"
        LastName
            :
            "dfg"
        Passport
            :
            Object
        Address
            :
            Object
        Building
            :
            "23"
        CityName
            :
            "Белая Калитва"
        Flat
            :
            "23"
        Index
            :
            "645645"
        Region
            :
            "Городской округ Адыгейск"
        StreetName
            :
            "Улица"
        Subject
            :
            "Республика Дагестан"
        __proto__
            :
            Object
        Emitent
            :
            "dfgdfgfdg"
        EmitentCode
            :
            "456456"
        IssueDate
            :
            Object
        Day
            :
            5
        Month
            :
            4
        Year
            :
            2016
        __proto__
            :
            Object
        Number
            :
            "67567"
        Seria
            :
            "567567"
        __proto__
            :
            Object
        PhoneNumber
            :
            "75555555555"
        PostAddress
            :
            Object
        Building
            :
            "23"
        CityName
            :
            "Белая Калитва"
        Flat
            :
            "23"
        Index
            :
            "645645"
        Region
            :
            "Городской округ Адыгейск"
        StreetName
            :
            "Улица"
        Subject
            :
            "Республика Дагестан"
        __proto__
            :
            Object
        PostAddressCheck
            :
            true
        SecondName
            :
            "dfg"
        SecretWord
            :
            "fdgdg"
        console.log('currentEntities',currentEntities)

        clients.list(currentEntities, function(data){
            blade.isLoading = false;


                        blade.origEntity = blade.currentEntity;
                        blade.parentBlade.refresh(true);

            console.log('blade.moduleId ',blade.moduleId)
        })

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

    blade.headIcon = 'fa-wrench';
    blade.toolbarCommands = [
        {
            name: "platform.commands.save",
            icon: 'fa fa-save',
            executeMethod: saveChanges,
            canExecuteMethod: function(){return true}//canSave
        },
        {
            name: "platform.commands.reset",
            icon: 'fa fa-eraser',
            executeMethod: function () {
                //angular.copy(blade.origEntity, blade.currentEntity);
                blade.currentEntity = angular.copy(blade.origEntity);
            },
            canExecuteMethod: isDirty
        },
        {
            name: "platform.commands.undo",
            icon: 'fa fa-undo',
            executeMethod: () =>{
                angular.copy(blade.origEntity, blade.currentEntity);
                bladeNavigationService.closeBlade(blade, '', function () {
                    let blade = $('.blade:last', $('.cnt'));
                    blade.addClass('__animate').animate({ 'margin-left': '-' + blade.width() + 'px' }, 145, function () {
                        blade.remove();
                    });
                });
            },
            canExecuteMethod: isDirty,
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

        $scope.formats = ['dd.MM.yy', 'dd-MMMM-yyyy', 'yyyy/MM/dd'];
        $scope.format = $scope.formats[0];

    }

    // actions on load
    blade.refresh();
}]);
