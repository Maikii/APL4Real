module.controller("larareKontaktCtrl", function ($scope, larareKontaktService, globalService) {
    //Hämta & visa kontakter om inloggad
    if (globalService.isLoggedIn(true)) {
        var anvandare = JSON.parse(localStorage.anvandare);
        var id_token = anvandare.id_token;
        larareKontaktService.getKontakt(id_token).then(function (data) {
            $scope.kontaktUppgifter = data;
        });
    }
});

