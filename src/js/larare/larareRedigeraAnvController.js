/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.controller("larareRedigeraAnvCtrl", function ($scope, larareRedigeraAnvService, globalService, larareService) {
    var id_token;
    if (globalService.isLoggedIn(true)) {
        var anvandare = JSON.parse(localStorage.anvandare);
        var id_token = anvandare.id_token;
    }

    $scope.rensa = function () {
        $scope.ddHandledare = -1;
        $scope.ddElev = -1;
        $scope.HLObj = {};
        $scope.elevObj = {};
        $scope.elevklass = -1;
        $scope.elevHL_id = null;
        document.getElementById("HLlosen").value = "";
    };

    $scope.laddaAnv = function () {
        larareService.getHL(id_token).then(function (data) {
            var handledare = [{
                    id : null,
                    namn_foretag : "Ingen Handledare"
            }];
            handledare = handledare.concat(data);
            $scope.HLLista = handledare;
            console.log(handledare);
        });

        larareService.getAnvandarensElever(id_token).then(function (data) {
            $scope.EleverLista = data;
        });

        larareService.getAllaKlasser().then(function (data) {
            $scope.klasser = data;
        });
    };

    $scope.laddaElev = function () {
        var elev_id = parseInt($scope.ddElev);
        larareRedigeraAnvService.getElevInfo(id_token, elev_id).then(function (data) {
            $scope.elevObj = data;
            $scope.elevklass = data.klass;
            $scope.elevHL_id = data.hl_id;
        });
    };

    $scope.laddaHL = function () {
        var hl_id = parseInt($scope.ddHandledare);
        larareRedigeraAnvService.getHLInfo(id_token, hl_id).then(function (data) {
            $scope.HLObj = data;
            console.log(data);
        });
    };

    $scope.sparaHL = function () {
        var url = "/larare/handledare/redigera";
        var id = parseInt($scope.ddHandledare);
        var namn = $scope.HLObj.namn;
        var tfnr = $scope.HLObj.tfnr;
        var email = $scope.HLObj.email;
        var foretag = $scope.HLObj.foretag;
        var anvnamn = $scope.HLObj.anvnamn;
        var losenord = document.getElementById("HLlosen").value;

        var data = {
            id: id,
            namn: namn,
            tfnr: tfnr,
            email: email,
            foretag: foretag,
            anvnamn: anvnamn,
            losenord: losenord
        };

        globalService.skickaData(url, data).then(function (responses) {
            if (responses[0].status < 200 || responses[0].status > 299) {
                globalService.notify("Ett fel inträffade, datan kommer skickas automatiskt.", "info");
            } else {
                globalService.notify("Handledaren har uppdaterats.", "success");
            }
            $scope.rensa();
        });
    };

    $scope.sparaElev = function () {
        var url = "/larare/elev/redigera";
        var id = parseInt($scope.ddElev);
        var namn = $scope.elevObj.namn;
        var tfnr = $scope.elevObj.tfnr;
        var email = $scope.elevObj.email;
        var klass = parseInt($scope.elevklass);
        var handledar_id = $scope.elevHL_id;
        var data = {
            id: id,
            namn: namn,
            tfnr: tfnr,
            email: email,
            klass: klass,
            hl_id: handledar_id
        };
        globalService.skickaData(url, data).then(function (responses) {
            if (responses[0].status < 200 || responses[0].status > 299) {
                globalService.notify("Ett fel inträffade, datan kommer skickas automatiskt.", "info");
            } else {
                globalService.notify("Eleven har uppdaterats.", "success");
            }
            $scope.rensa();
        });
    };
});
