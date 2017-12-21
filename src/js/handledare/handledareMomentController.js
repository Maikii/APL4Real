module.controller("handledareMomentCtrl", function ($scope, handledareMomentService, globalService, handledareService) {
    //Hämta text för det språk som är valt
    $scope.getText = function (text) {
        return handledareService.getText(text);
    };
    //Hämta & visa moment
    $scope.handledareSeMoment = function () {
        //Inloggad? (ej google)
        if (globalService.isLoggedIn(false)) {
            var basic_auth = JSON.parse(localStorage.anvandare).basic_auth;
            //Hämta elever
            handledareService.getElever(basic_auth).then(function (elever) {
                $scope.elever = elever;
                //Hämta moment
                handledareMomentService.handledareSeMoment(basic_auth).then(function (data) {
                    //Om handledaren bara har en elev, bara visa upp datan
                    if ($scope.elever.length === 1) {
                        $scope.moments = data;
                    } else {
                        //Fler än en elev, spara datan för att visa senare
                        $scope.allMoment = data;
                        if (!$scope.selected_elev) {
                            $scope.selected_elev = data[0].elev_id;
                            $scope.showMoment($scope.selected_elev);
                        }
                    }
                });
            });
        }
    };
    //Visa moment för specifik elev
    $scope.showMoment = function (id) {
        $scope.moments = [];
        for (var i = 0; i < $scope.allMoment.length; i++) {
            if ($scope.allMoment[i].elev_id === id)
                $scope.moments.push($scope.allMoment[i]);
        }
    };
    $scope.getStatus = function (status) {
        return handledareService.getText("status" + status);
    };
});