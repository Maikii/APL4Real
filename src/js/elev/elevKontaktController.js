module.controller("elevKontaktCtrl", function ($scope, elevKontaktService, globalService) {
    //Hämta och visa kontakter om inloggad
    if (globalService.isLoggedIn(true)) {
        var anvandare = JSON.parse(localStorage.anvandare);
        var id_token = anvandare.id_token;
        elevKontaktService.getKontakt(id_token).then(function (data) {
            $scope.kontakter = data;
        });
    }
});
