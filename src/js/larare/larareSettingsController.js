module.controller("larareSettingsCtrl", function ($scope, globalService, larareService, registrationService) {
    //Lägg till i scope för användning i template
    $scope.larareService = larareService;
    //Hämta & visa klasser / oskickat om inloggad
    if (globalService.isLoggedIn(true)) {
        registrationService.getKlasser().then(function (data) {
            $scope.klasser = data;
        });
        $scope.oskickat = [];
        if (localStorage.oskickat)
            $scope.oskickat = JSON.parse(localStorage.oskickat);
    }
    //Byt klass på användaren
    $scope.changeKlass = function (klass_id) {
        var targetUrl = "/larare/klasschange";
        var data = {
            klass_id: klass_id
        };
        globalService.skickaData(targetUrl, data).then(function (responses) {
            if (responses[0].status < 200 || responses[0].status > 299) {
                globalService.notify("Ett fel inträffade, datan kommer skickas automatiskt.", "info");
            } else {
                globalService.notify("Du har bytt klass.", "success");
            }
        });
    };
    //Ta bort oskickad data
    $scope.raderaOskickat = function (item) {
        var index = $scope.oskickat.indexOf(item);
        if (index > -1)
            $scope.oskickat.splice(index, 1);
        localStorage.oskickat = JSON.stringify($scope.oskickat);
    };
});

