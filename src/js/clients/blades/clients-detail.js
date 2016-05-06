angular.module('sdl.management')
.controller('sdl.management.clientsDetailController',
    ['$scope', 'sdl.management.dialogService',
        'sdl.management.settings.helper', 'sdl.management.bladeNavigationService', 'sdl.management.settings', function ($scope, dialogService, settingsHelper, bladeNavigationService, settings) {
    var blade = $scope.blade;
    blade.updatePermission = 'module:client:update';

    blade.refresh = function () {
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
        settingsHelper.fixValues(results);

        _.each(results, function (setting) {
            // set group names to show.
            if (setting.groupName) {
                var paths = setting.groupName.split('|');
                setting.groupName = paths.pop();
            }

            // transform to va-generic-value-input suitable structure
            setting.isDictionary = _.any(setting.allowedValues);
            setting.values = setting.isDictionary ? [{ value: { id: setting.value, name: setting.value } }] : [{ id: setting.value, value: setting.value }];
            if (setting.allowedValues) {
                setting.allowedValues = _.map(setting.allowedValues, function (x) {
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

    $scope.editArray = function (node) {
        var newBlade = {
            id: "settingDetailChild",
            currentEntityId: node.name,
            controller: 'sdl.management.settingDictionaryController',
            template: 'templates/settings/blades/setting-dictionary.tpl.html'
        };
        bladeNavigationService.showBlade(newBlade, blade);
    }

    var formScope;
    $scope.setForm = function (form) { formScope = form; };

    function isDirty() {
        return !angular.equals(blade.currentEntities, blade.origEntity) && blade.hasUpdatePermission();
    }

    function canSave() {
        return isDirty() && formScope && formScope.$valid;
    }

    function saveChanges() {
        blade.isLoading = true;
        var objects = _.flatten(_.map(blade.currentEntities, _.values));
        objects = _.map(objects, function (x) {
            x.value = x.isDictionary ? x.values[0].value.id : x.values[0].value;
            x.values = undefined;
            return x;
        });

        var selectedSettings = _.where(objects, { isArray: true });
        _.forEach(selectedSettings, function (setting) {
            if (setting.arrayValues) {
                setting.arrayValues = _.pluck(setting.arrayValues, 'value');
            }
        });

        //console.log('saveChanges3: ' + angular.toJson(objects, true));
        settings.update({}, objects, function (data, headers) {
            if (blade.moduleId) {
                blade.refresh();
            } else {
                blade.origEntity = blade.currentEntities;
                blade.parentBlade.refresh(true);
            }
        }, function (error) {
            bladeNavigationService.setError('Error ' + error.status, blade);
        });
    };

    blade.headIcon = 'fa-wrench';
    blade.toolbarCommands = [
        {
            name: "Сохранить", icon: 'fa fa-save',
            executeMethod: saveChanges,
            canExecuteMethod: canSave            
        },
        {
            name: "Отмена", icon: 'fa fa-undo',
            executeMethod: function () {
                blade.currentEntities = angular.copy(blade.origEntity);
            },
            canExecuteMethod: isDirty
        }
    ];
    
    blade.onClose = function (closeCallback) {
        bladeNavigationService.showConfirmationIfNeeded(isDirty(), canSave(), blade, saveChanges, closeCallback, "platform.dialogs.settings-delete.title", "platform.dialogs.settings-delete.message");
    };

    $scope.getDictionaryValues = function (setting, callback) {
        callback(setting.allowedValues);
    }

    // actions on load
    blade.refresh();
}]);
