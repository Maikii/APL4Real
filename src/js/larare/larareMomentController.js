module.controller("larareMomentCtrl", function ($scope, larareMomentService, globalService, larareService) {
    //Lägg till i scope för användning i template
    $scope.larareService = larareService;
    $scope.nyaMoment = [];
    var id_token;
    //Inloggad? (som google)
    if (globalService.isLoggedIn(true)) {
        var anvandare = JSON.parse(localStorage.anvandare);
        id_token = anvandare.id_token;
    }
    //Hämtar alla klasser från lärarens program
    $scope.getKlasser = function () {
        larareService.getKlasser(id_token).then(function (data) {
            $scope.klasser = data;
        });
    };

    //Hämtar alla moment som läraren har skapat
    $scope.getMomentLarare = function () {
        larareMomentService.getMomentLärare(id_token).then(function (data) {
            $scope.lararMoment = data;
        });
    };

    //Hämta elever, använder ng-change för att uppdatera
    $scope.getElever = function (klass_id) {
        larareService.setSetting('lastKlass', klass_id);
        larareService.getElever(id_token, klass_id).then(function (data) {
            $scope.elever = data;
        });
    };

    //Hämta moment, använder ng-change för att uppdatera
    $scope.getMoment = function (elev_id) {
        larareMomentService.getMoment(id_token, elev_id).then(function (data) {
            $scope.moment = data;
        });
    };

    //Siffror till ord
    $scope.parseMoment = function (p) {
        if (p === 0) {
            return "Ej avklarad";
        } else if (p === 1) {
            return "Väntande svar";
        } else if (p === 2) {
            return "Avklarad";
        } else if (p === 3) {
            return "Nekad";
        }
    };

    //Skicka moment
    $scope.sparaMoment = function () {
        var innehall = document.getElementById("momentInnehall").value;
        if (innehall.toString().trim() !== "") {
            var data = {"beskrivning": innehall};
            var url = "/larare/moment";
            globalService.skickaData(url, data).then(function (responses) {
                if (responses[0].status < 200 || responses[0].status > 299) {
                    globalService.notify("Ett fel inträffade, datan kommer skickas automatiskt.", "info");
                } else {
                    globalService.notify("Momentet är sparat.", "success");
                    //Uppdatera momentlistan
                    $scope.getMomentLarare();
                }
            });
            document.getElementById("momentInnehall").value = "";
        }
    };

    //Ta bort moment
    $scope.raderaMoment = function (moment_id) {
        larareMomentService.larareRaderaMoment(id_token, moment_id).then(function (status) {
            if (status === "error")
                globalService.notify("Lyckades inte ta bort momentet.", "danger");
            else {
                globalService.notify("Momentet har tagits bort.", "success");
                //Ta bort från listan
                var index = arrayObjectIndexOf($scope.lararMoment, moment_id, "id");
                if (index > -1)
                    $scope.lararMoment.splice(index, 1);
            }
        });
    };

    //Ta bort moment från elev
    $scope.raderaMomentElev = function (moment_id, elev_id) {
        larareMomentService.elevRaderaMoment(id_token, moment_id, elev_id).then(function (status) {
            if (status === "error")
                globalService.notify("Lyckades inte ta bort momentet.", "danger");
            else {
                globalService.notify("Momentet har tagits bort från eleven.", "success");
                //Ta bort från listan
                var index = arrayObjectIndexOf($scope.moment, moment_id, "moment");
                if (index > -1)
                    $scope.moment.splice(index, 1);
            }
        });
    };
});