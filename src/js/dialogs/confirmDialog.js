angular.module('sdl.management')
.controller('sdl.management.confirmDialogController', ['$scope', '$modalInstance', 'dialog', function ($scope, $modalInstance, dialog) {
    angular.extend($scope, dialog);

    $scope.yes = function () {
        $modalInstance.close(true);
    };

    $scope.no = function () {
        $modalInstance.close(false);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}])
.factory('sdl.management.dialogService', ['$rootScope', '$modal', function ($rootScope, $modal) {
    var dialogService = {
        dialogs: [],
        currentDialog: undefined
    };

    function findDialog(id) {
        var found;
        angular.forEach(dialogService.dialogs, function (dialog) {
            if (dialog.id == id) {
                found = dialog;
            }
        });

        return found;
    }

    dialogService.showDialog = function (dialog, templateUrl, controller, cssClass) {
        var dlg = findDialog(dialog.id);

        if (angular.isUndefined(dlg)) {
            dlg = dialog;

            dlg.instance = $modal.open({
                templateUrl: templateUrl,
                controller: controller,
                windowClass: cssClass ? cssClass : null,
                resolve: {
                    dialog: function () {
                        return dialog;
                    }
                }
            });

            dlg.instance.result.then(function (result) //success
            {
                var idx = dialogService.dialogs.indexOf(dlg);
                dialogService.dialogs.splice(idx, 1);
                if (dlg.callback)
                    dlg.callback(result);
            }, function (reason) //dismiss
            {
                var idx = dialogService.dialogs.indexOf(dlg);
                dialogService.dialogs.splice(idx, 1);
            });

            dialogService.dialogs.push(dlg);
        }
    };

    dialogService.showConfirmationDialog = function (dialog) {
        dialogService.showDialog(dialog, 'templates/dialogs/confirmDialog.tpl.html', 'sdl.management.confirmDialogController');
    };

    dialogService.showNotificationDialog = function (dialog) {
        dialogService.showDialog(dialog, 'templates/dialogs/notifyDialog.tpl.html', 'sdl.management.confirmDialogController');
    };

    dialogService.showGalleryDialog = function (dialog) {
        dialogService.showDialog(dialog, 'templates/dialogs/galleryDialog.tpl.html', 'sdl.management.galleryDialogController', '__gallery');
    };

    return dialogService;

}])
