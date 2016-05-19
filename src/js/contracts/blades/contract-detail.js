angular.module('sdl.management')
.controller('sdl.management.contractDetailCtrl',
    ['$scope', '$interval', 'sdl.management.dialogService', 'sdl.management.bladeNavigationService', 'sdl.management.settings',
        'sdl.management.contractsave',  'sdl.management.contractedit', 'sdl.management.contractdelete', 'sdl.management.contracts',
        'sdl.management.timezone', 'sdl.management.AbonType', 'sdl.management.Products',
        'sdl.management.cars', 'sdl.management.colors', 'billingTemplatesBase',
    function ($scope, $interval, dialogService, bladeNavigationService, settings,
              contractsave,  contractedit, contractdelete, clientcontract, timezoneService, AbonTypeService, ProductsService,
              carsService, colorsService, billingTemplatesBase) {

        var blade = $scope.blade;
        blade.updatePermission = 'module:client:update';

        blade.isLoading = false;

    // get timezone
        timezoneService.list({}, function (data) {
            $scope.UtcOffsetHours = data.timezone;
        });

        // get color car
        $scope.colors = [];
        colorsService.list({}, function (data) {
            $scope.colors = data.colors;
        });
        //get cars
        carsService.list({"Id": blade.data.clientId}, function (res) {
            $scope.cars = res.Data;

            $scope.$watch($scope.colors, function(){
                if($scope.colors.length < 1 ) return;

                //console.log($scope.colors)
                let des = (new deserialize());

                _.each($scope.cars, function(item){
                    item.Color = des.fldsToJson(item.Color,$scope.colors);
                    //console.log('blade.currentEntity.Vehicle-item=>',blade.currentEntity.Vehicle);
                })

            });
        });
     //get AbonType
        AbonTypeService.list({}, function (res) {
            $scope.AbonTypes = res.Data;
        });
    ////get products
        $scope.getProductList = function(node){
            $scope.products = [];
            blade.currentEntity.Product = '';
            ProductsService.list({"abontypeId": node.selected.Id}, function (res) {
                $scope.products = res.Data;
            });
        }




        function deserialize(data) {

            let checkLoadBase = (baseList, callback) => {
                let keyInterval = $interval(function(){  // check load the base
                    if ($scope[baseList] != undefined) {
                        callback();
                        $interval.cancel(keyInterval);
                    }
                },500);

            }

            let fieldsToJson = (fVal, baseList, fieldName = "name") => {
                 let choseItemOfSelect = _.find(baseList, function(o) { return (o[fieldName] == fVal) ? angular.copy(o) : null; });
                return (choseItemOfSelect === null) ? fVal : choseItemOfSelect
                //= _.find($scope.colors, function(o) { return (o.name == data.Color) ? o : null; });
            };

            this.fldsToJson = (typeof fieldsToJson === 'function') ? fieldsToJson : function(){};


            if(data) {

                if (data.BeginDate) {
                    data.BeginDate = new Date(data.BeginDate.Month + '.' + data.BeginDate.Day + "." + data.BeginDate.Year);
                }

                if (data.UtcOffsetHours || data.UtcOffsetHours == 0) {
                    checkLoadBase('UtcOffsetHours', ()=> {
                        data.UtcOffsetHour = fieldsToJson(data.UtcOffsetHours, $scope.UtcOffsetHours, "number");
                    })
                }
                if(data.Vehicle.Color){
                    checkLoadBase('colors',()=>{
                        data.Vehicle.Color = fieldsToJson(data.Vehicle.Color,$scope.colors);
                    })
                }

            }
            //if(data.IssueYear){
            //    checkLoadBase('IssueYears',()=>{
            //        data.IssueYear = fieldsToJson(data.IssueYear,$scope.IssueYears);
            //    })
            //}
            //if(data.Make){
            //    checkLoadBase('makes',()=>{
            //        data.Make = fieldsToJson(data.Make,$scope.makes);
            //    })
            //}
            //if(data.Model){
            //    checkLoadBase('models',()=>{
            //        data.Model = fieldsToJson(data.Model,$scope.models);
            //    })
            //}
            return data;
        }

        blade.refresh = function () {
             initializeBlade(angular.copy(blade.data));
        }

        function initializeBlade(results) {
           // settings.fixValues(results);

            blade.isLoading = false;

            if(results == undefined) { // new
                blade.currentEntity = {};
                blade.origEntity = {};
            }else{ // edit
                blade.currentEntity = new deserialize(angular.copy(results));
                blade.origEntity = new deserialize(results);

                console.log('blade.currentEntity',blade.currentEntity);
            }
        }


        var formScope = {};
        $scope.setForm = function (form) { formScope = form;};

        function isDirty() {
            return !angular.equals(blade.currentEntity, blade.origEntity) && blade.hasUpdatePermission();
        }

        function canSave() {
            return isDirty() && formScope && formScope.$valid;
        }

        function serialize (entities){
            let currentEntities = serialize_select (entities,"Id");


            if(currentEntities.BeginDate){
                let date = currentEntities.BeginDate;

                currentEntities.BeginDate = {
                    "Year": date.getFullYear(),
                    "Month": date.getMonth(),
                    "Day": date.getDate()
                }

            }
            if(currentEntities.Vehicle){
                currentEntities.VehicleId = currentEntities.Vehicle;
                delete currentEntities.Vehicle;
            }
            if(currentEntities.Product){
                currentEntities.ProductId = currentEntities.Product;
                delete currentEntities.Product;
            }
            if(currentEntities.UtcOffsetHour){
                currentEntities.UtcOffsetHours = currentEntities.UtcOffsetHour.number;
                delete currentEntities.UtcOffsetHour;
            }

            return currentEntities;
        }

        function serialize_select (entities, propertyName = "name"){
            for (let pr in entities) {
                if(typeof entities[pr] === 'object'){

                    if(entities[pr] && (entities[pr][propertyName] != undefined)){
                        entities[pr] = entities[pr][propertyName];
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

            if(currentEntities.ContractNumber){ // edit exited
                contractedit.list(currentEntities, function(data){
                    blade.isLoading = false;
                    blade.error = '';
                    blade.origEntity = blade.currentEntity;
                    blade.parentBlade.refresh(true);
                    closeBlade();
                },function(err){
                    blade.isLoading = false;
                    blade.error = (err.data)?err.data[Object.keys( err.data )[0]][0]:'';
                });
            }else{// add new

                contractsave.list(currentEntities, function(data){
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

        function delcontract() {
            blade.isLoading = true;

            contractdelete.list(blade.currentEntity, function(data){
                blade.isLoading = false;
                blade.error = '';
                blade.origEntity = blade.currentEntity;
                blade.parentBlade.refresh(true);
                closeBlade();
            });
        }

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
                name: "platform.commands.print",
                icon: 'fa fa-print',
                executeMethod: ()=>{},
                canExecuteMethod: function(){ return true;},
                permission: blade.updatePermission
            },
            {
                name: "platform.commands.sign",
                icon: 'fa fa-print',
                executeMethod: ()=>{},
                canExecuteMethod: function(){ return true;},
                permission: blade.updatePermission
            }
            //{
            //    name: "platform.commands.remove",
            //    icon: 'fa fa-trash-o',
            //    executeMethod: delcontract,
            //    canExecuteMethod: function(){ return (blade.origEntity)? true : false;},
            //    permission: blade.updatePermission
            //}

        ];

        blade.onClose = function (closeCallback) {
            bladeNavigationService.showConfirmationIfNeeded(isDirty(), canSave(), blade, saveChanges, closeCallback, "platform.dialogs.settings-delete.title", "platform.dialogs.settings-delete.message");
        };

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

        $scope.refreshResults = function($select){

            var search = $select.search,
                list = angular.copy($select.items),
                FLAG = -1;

            //remove last user input
            list = list.filter(function(item) {
                return item.id !== FLAG;
            });

            if (!search) {
                //use the predefined list
                $select.items = list;
            }
            else {
                //manually add user input and set selection
                var userInputItem = {
                    id: FLAG,
                    name: search
                };
                $select.items = [userInputItem].concat(list);
                $select.selected = userInputItem;
            }
        }

        $scope.clear = function ($event, $select){
            $event.stopPropagation();
            //to allow empty field, in order to force a selection remove the following line
            $select.selected = undefined;
            //reset search query
            $select.search = undefined;
            //focus and open dropdown
            $select.activate();
        }

        blade.refresh();

}]);
