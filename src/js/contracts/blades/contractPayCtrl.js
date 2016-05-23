angular.module('sdl.management')
.controller('sdl.management.contractPayCtrl',   ['$injector', '$scope', 'sdl.management.contractPay',
function ($injector, $scope, contractPayService) {
    var settingsTree;
    var blade = $scope.blade;

    blade.isLoading = false;
    $scope.opts = {
        currentPage: 1,
        countPays: 10
    };
    console.log(blade)
    blade.refresh = function (disableOpenAnimation) {

        //blade.isLoading = true;


        blade.allPays = [];

        blade.currentEntity =  blade.data;

        //contracts.list({"Id": blade.data.clientId},function(result){
        //    blade.allPays = deserialize(result.Data);
        //
        //    blade.isLoading = false;
        //})

    };

    $scope.payContract = function(){
        blade.isLoading = true;

        contractPayService.list(blade.currentEntity,function(res){
            blade.isLoading = false;
            blade.error = '';
            console.log(res);
            //blade.origEntity = blade.currentEntity;

        })
    }

     //Breadcrumbs
    function setBreadcrumbs(node) {
        blade.breadcrumbs.splice(1, blade.breadcrumbs.length - 1);

        if (node.groupName) {
            var lastParentId = '';
            var lastchildren = settingsTree;
            var paths = node.groupName.split('|');
            _.each(paths, function (path) {
                lastchildren = lastchildren[path].children;
                lastParentId += '|' + path;
                var breadCrumb = {
                    id: lastParentId.substring(1),
                    name: path,
                    children: lastchildren,
                    navigate: function () {
                        $scope.selectNode({ groupName: this.id, children: this.children });
                    }
                };

                blade.breadcrumbs.push(breadCrumb);
            });
        }
    }

    blade.breadcrumbs = [{
        id: null,
        name: "platform.navigation.bread-crumb-top",
        navigate: function () {
            $scope.selectNode({ groupName: null, children: settingsTree });
        }
    }];

    blade.headIcon = 'fa-credit-card';


    ///////\grid
    $scope.loadMore = function(){
        $scope.opts.currentPage += 1;
        blade.refresh(function(data) {
            blade.isLoading = false;
            blade.allPays =  blade.allPays.concat(data);
        })
    };

    // actions on load
    blade.refresh();
}]);