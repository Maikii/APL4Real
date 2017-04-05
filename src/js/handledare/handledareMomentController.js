module.controller("handledareMomentCtrl", function ($scope, handledareMomentService, globalService, handledareService) {
    $scope.getText = function (text) {
        return handledareService.getText(text);
    };
    $scope.handledareSeMoment = function () {
        if (globalService.isLoggedIn(false)) {
            var basic_auth = JSON.parse(localStorage.anvandare).basic_auth;
            handledareService.getElever(basic_auth).then(function (elever) {
                $scope.elever = elever;
                handledareMomentService.handledareSeMoment(basic_auth).then(function (data) {
                    if ($scope.elever.length == 1) {
                        $scope.moments = data;
                    } else {
                        $scope.allMoment = data;
                        if(!$scope.selected_elev) {
                            $scope.selected_elev = data[0].elev_id;
                            $scope.showMoment($scope.selected_elev);
                        }
                    }
                });
            });
        }
    }
    $scope.showMoment = function (id) {
        $scope.moments = [];
        for (var i = 0; i < $scope.allMoment.length; i++) {
            if ($scope.allMoment[i].elev_id == id)
                $scope.moments.push($scope.allMoment[i]);
        }
    }
    $scope.getStatus = function (status) {
        return handledareService.getText("status" + status);
    };
});