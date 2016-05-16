angular.module('sdl.management')
.controller('sdl.management.carDetailCtrl',
    ['$scope', 'sdl.management.dialogService', 'sdl.management.bladeNavigationService', 'sdl.management.settings',
        'sdl.management.carsave',  'sdl.management.cars', 'sdl.management.colors', 'sdl.management.makes', 'sdl.management.models',
        'billingTemplatesBase',
    function ($scope, dialogService, bladeNavigationService, settings,
              carsave,  clientcar, colorsService, makesService, modelsService,
              billingTemplatesBase) {

        var blade = $scope.blade;
        blade.updatePermission = 'module:client:update';

        blade.isLoading = false;
console.log('blade car', blade);

    // get color car
        colorsService.list({}, function (data) {
            $scope.colors = data.colors;
        });
    // yaers
        $scope.IssueYears = [];
        {
            let startYear = (new Date()).getFullYear();
            let endYear = 1892;
            for(let i=startYear; endYear < i; i--){
                $scope.IssueYears.push({"name": i});
            }
        }

     //get marka car
        makesService.list({}, function (data) {
            $scope.makes = data.marka;
        });
    //get model car
        modelsService.list({}, function (data) {

            $scope.models = data.model;
        });


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


            //}
        }
        initializeBlade(angular.copy(blade.data));

        function initializeBlade(results) {
           // settings.fixValues(results);

            blade.isLoading = false;

            if(results == undefined) { // new
                blade.currentEntity = {};
                blade.origEntity = {};
            }else{ // edit
                deserialize(results);
                blade.currentEntity = angular.copy(results);
                blade.origEntity = results;
            }
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

            return currentEntities;
        }
        function serialize_select (entities){
        for (let pr in entities) {
            if(typeof entities[pr] === 'object'){

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
            carsave.list(currentEntities, function(data){
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
            console.log('add new')
            console.log('add new',currentEntities)
            carsave.list(currentEntities, function(data){
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
            name: "platform.commands.remove",
            icon: 'fa fa-trash-o',
            executeMethod: () =>{

            },
            canExecuteMethod: function(){ return (blade.origEntity)? true : false;},
            permission: blade.updatePermission
        }

    ];
    
    blade.onClose = function (closeCallback) {
        bladeNavigationService.showConfirmationIfNeeded(isDirty(), canSave(), blade, saveChanges, closeCallback, "platform.dialogs.settings-delete.title", "platform.dialogs.settings-delete.message");
    };

    //$scope.getDictionaryValues = function (setting, callback) {
    //    callback(setting.allowedValues);
    //}


}]);
