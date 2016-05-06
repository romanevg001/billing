angular.module('sdl.management')
    .controller('sdl.management.clientCreateController',
    [
        '$scope', 'sdl.management.dialogService',
        'sdl.management.bladeNavigationService',
        'sdl.management.clients',
        function($scope, dialogService, bladeNavigationService, clients) {
            var blade = $scope.blade;
            blade.updatePermission = 'module:client:create';

            blade.save = function() {
                if (blade.moduleId) {
                    blade.isLoading = true;

                    clients.getSettings({ id: blade.moduleId }, initializeBlade,
                        function(error) {
                            bladeNavigationService.setError('Error ' + error.status, blade);
                        });
                } else {
                    initializeBlade(angular.copy(blade.data));
                }
            };

            function initializeBlade(results) {
                settingsHelper.fixValues(results);

                _.each(results, function(setting) {
                    // set group names to show.
                    if (setting.groupName) {
                        var paths = setting.groupName.split('|');
                        setting.groupName = paths.pop();
                    }

                    // transform to va-generic-value-input suitable structure
                    setting.isDictionary = _.any(setting.allowedValues);
                    setting.values = setting.isDictionary ? [{ value: { id: setting.value, name: setting.value } }] : [{ id: setting.value, value: setting.value }];
                    if (setting.allowedValues) {
                        setting.allowedValues = _.map(setting.allowedValues, function(x) {
                            return { id: x, name: x };
                        });
                    }
                });


                results = _.groupBy(results, 'groupName');
                blade.groupNames = _.keys(results);
                blade.currentEntities = angular.copy(results);
                blade.origEntity = results;
                blade.isLoading = false;
            }

            var formScope;

            $scope.setForm = function(form) { formScope = form; };

            function canSave() {
                return formScope && formScope.$valid;
            }

            function saveChanges() {
                blade.isLoading = true;
                var objects = _.flatten(_.map(blade.currentEntities, _.values));
                objects = _.map(objects, function(x) {
                    x.value = x.isDictionary ? x.values[0].value.id : x.values[0].value;
                    x.values = undefined;
                    return x;
                });

                var selectedSettings = _.where(objects, { isArray: true });
                _.forEach(selectedSettings, function(setting) {
                    if (setting.arrayValues) {
                        setting.arrayValues = _.pluck(setting.arrayValues, 'value');
                    }
                });


                //console.log('saveChanges3: ' + angular.toJson(objects, true));
                clients.put(objects).then( function(data, headers) {
                    if (blade.moduleId) {
                        blade.refresh();
                    } else {
                        blade.origEntity = blade.currentEntities;
                        blade.parentBlade.refresh(true);
                    }
                }, function(error) {
                    bladeNavigationService.setError('Error ' + error.status, blade);
                });
            };

            blade.headIcon = 'fa-wrench';
            blade.toolbarCommands = [
                {
                    name: "platform.commands.save",
                    icon: 'fa fa-save',
                    executeMethod: saveChanges,
                    canExecuteMethod: canSave
                },
                {
                    name: "platform.commands.reset",
                    icon: 'fa fa-eraser',
                    executeMethod: function() {
                        blade.currentEntities = angular.copy(blade.origEntity);
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
                    canExecuteMethod: isDirty

                }
            ];

            blade.onClose = function(closeCallback) {
                bladeNavigationService.showConfirmationIfNeeded(isDirty(), canSave(), blade, saveChanges, closeCallback, "platform.dialogs.settings-delete.title", "platform.dialogs.settings-delete.message");
            };

            $scope.getDictionaryValues = function(setting, callback) {
                callback(setting.allowedValues);
            };


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

            // actions on load
            blade.refresh();
        }
    ]);
