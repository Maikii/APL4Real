module.controller("handledareKontaktCtrl", function ($scope, handledareKontaktService, globalService, handledareService) {
    //Hämta text för det språk som är valt
    $scope.getText = function (text) {
        return handledareService.getText(text);
    };
    $scope.getTyp = function (typ) {
        var text = typ === 1 ? "larare" : "elev";
        return handledareService.getText(text);
    };
    //Inloggad? (ej google)
    if (globalService.isLoggedIn(false)) {
        //Hämta & visa kontakter
        var anvandare = JSON.parse(localStorage.anvandare);
        var basic_auth = anvandare.basic_auth;
        handledareKontaktService.getKontakt(basic_auth).then(function (data) {
            $scope.kontakter = data;
        });
    }
});

