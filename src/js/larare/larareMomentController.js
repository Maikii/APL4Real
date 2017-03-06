/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


module.controller("larareMomentCtrl", function ($scope, larareMomentService, globalService, larareService) {
    $scope.larareService = larareService;
    var id_token;
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

    //Hämtar alla mment som läraren har skapat
    $scope.getMomentLarare = function () {
        larareMomentService.getMomentLärare(id_token).then(function (data) {
            $scope.lararMoment = data;
        });
    };

    // hämta elever använder ng-change för att uppdatera
    $scope.getElever = function (klass_id) {
        larareService.setSetting('lastKlass', klass_id);
        larareService.getElever(id_token, klass_id).then(function (data) {
            $scope.elever = data;
        });
    };

    //hämta moment använder ng-change för att uppdatera
    $scope.getMoment = function (elev_id) {
        larareMomentService.getMoment(id_token, elev_id).then(function (data) {
            $scope.moment = data;
        });
    };

    $scope.parseMoment = function (p) {
        console.log(p);
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
                }
            });
            document.getElementById("momentInnehall").value = "";
        }
    };

    $scope.raderaMoment = function (moment_id) {
        larareMomentService.larareRaderaMoment(id_token, moment_id).then(function (status) {
            if (status === "error")
                globalService.notify("Lyckades inte ta bort momentet.", "danger");
            else {
                globalService.notify("Momentet har tagits bort.", "success");
                location.reload();//TODO: Ladda inte om hela sidan, ta bara bort momentet från listan
            }
        });
    };
    $scope.raderaMomentElev = function (moment_id, elev_id) {
        larareMomentService.elevRaderaMoment(id_token, moment_id, elev_id).then(function (status) {
            if (status === "error")
                globalService.notify("Lyckades inte ta bort momentet.", "danger");
            else {
                globalService.notify("Momentet har tagits bort från eleven.", "success");
                location.reload();//TODO: Ladda inte om hela sidan, ta bara bort momentet från listan
            }
        });
    };
});
