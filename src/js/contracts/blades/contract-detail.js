angular.module('sdl.management')
.controller('sdl.management.contractDetailCtrl',
    ['$scope', '$interval', 'sdl.management.dialogService', 'sdl.management.bladeNavigationService', 'sdl.management.settings',
        'sdl.management.contractsave',  'sdl.management.contractedit', 'sdl.management.contractdelete', 'sdl.management.contracts',
        'sdl.management.timezone', 'sdl.management.AbonType', 'sdl.management.Products',
        'sdl.management.cars', 'billingTemplatesBase',
    function ($scope, $interval, dialogService, bladeNavigationService, settings,
              contractsave,  contractedit, contractdelete, clientcontract, timezoneService, AbonTypeService, ProductsService,
              carsService, billingTemplatesBase) {

        var blade = $scope.blade;
        blade.updatePermission = 'module:client:update';

        blade.isLoading = false;

    // get timezone
        timezoneService.list({}, function (data) {
            $scope.UtcOffsetHours = data.timezone;
        });

    //// yaers
    //    $scope.IssueYears = [];
    //    {
    //        let startYear = (new Date()).getFullYear();
    //        let endYear = 1892;
    //        for(let i=startYear; endYear < i; i--){
    //            $scope.IssueYears.push({"name": i});
    //        }
    //    }
    //


        //get cars
        carsService.list({"Id": blade.data.clientId}, function (res) {
            $scope.cars = res.Data;
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




        let deserialize = (data) =>{

            let checkLoadBase = (baseList, callback) => {
                let keyInterval = $interval(function(){  // check load the base
                    //console.log('baseList = ',$scope)
                    if ($scope[baseList] != undefined) {
                        callback();
                        //$scope.$apply(function () {  });
                        $interval.cancel(keyInterval);
                    }
                },500);
                console.log(keyInterval)
            }

            let fieldsToJson = (fVal, baseList) => {
                 let choseItemOfSelect = _.find(baseList, function(o) { return (o.name == fVal) ? angular.copy(o) : null; });
                return (choseItemOfSelect === null) ? fVal : choseItemOfSelect
                //= _.find($scope.colors, function(o) { return (o.name == data.Color) ? o : null; });
            };

            if(data.Color){
                checkLoadBase('colors',()=>{
                    data.Color = fieldsToJson(data.Color,$scope.colors);
                })
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
                blade.currentEntity = deserialize(angular.copy(results));
                blade.origEntity = deserialize(results);
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
            },
            {
                name: "platform.commands.remove",
                icon: 'fa fa-trash-o',
                executeMethod: delcontract,
                canExecuteMethod: function(){ return (blade.origEntity)? true : false;},
                permission: blade.updatePermission
            }

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
