/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


module.controller("elevAktivitetCtrl", function ($scope, $window, elevAktivitetService, globalService) {
    $scope.parseLjus = function (i) {
        if (i === 0)
            return "frånvarande";
        else if (i === 1)
            return "delvis närvarande";
        else if (i === 2)
            return "närvarande hela";
    };
    $scope.parseRubrik = function (i) {
        if (i === 0)
            return "Närvaro";
        else if (i === 1)
            return "Loggbok";
        else if (i === 2)
            return "Moment";
    };
    $scope.getBildUrl = function (bild, storlek) {
        //tar bort citattecknen som kommer vem fan vet var ifrån
        bild = bild.substr(1, bild.length - 2);
        if (storlek)
            return IMG_SERVER_URL + "?file=" + bild + "&size=" + storlek;
        else
            return IMG_SERVER_URL + "?file=" + bild;
    };
    $scope.getNekadeAktiviteter = function () {
        if (globalService.isLoggedIn(true)) {
            var id_token = JSON.parse(localStorage.anvandare).id_token;
            elevAktivitetService.getNekadeAktiviteter(id_token).then(function (data) {
                $scope.aktiviteter = data[0];
                console.log(data);
            });
        }
    };
    $scope.show = function (e) {
        $(".aktivitet").not("#" + e.$id).slideUp();
        $("#" + e.$id).slideToggle();
    };
    $scope.skickaMoment = function (index) {
        var item = $scope.aktiviteter.splice(index, 1)[0];
        var data = {
            id: item.id,
            typ: item.typ
        };
        $scope.skickaElev(data);
    };
    $scope.skickaLogg = function (index, text) {
        var item = $scope.aktiviteter.splice(index, 1)[0];
        var data = {
            id: item.id,
            typ: item.typ,
            innehall: text
        };
        $scope.skickaElev(data);
    };
    $scope.skickaNarvaro = function (index, trafikljus) {
        var item = $scope.aktiviteter.splice(index, 1)[0];
        var data = {
            id: item.id,
            typ: item.typ,
            trafikljus: parseInt(trafikljus)
        };
        $scope.skickaElev(data);
    };
    $scope.raderaLogg = function (index) {
        var id_token = JSON.parse(localStorage.anvandare).id_token;
        var item = $scope.aktiviteter.splice(index, 1)[0];
        var id = item.id;
        elevAktivitetService.raderaLogg(id_token, id).then(function (status) {
            if (status === "error") {
                globalService.notify("Kunde inte radera loggboken, försök igen senare.", "danger");
            } else {
                globalService.notify("Loggboken har blivit raderad.", "success");
            }
        });
    };
    $scope.raderaNarvaro = function (index) {
        var id_token = JSON.parse(localStorage.anvandare).id_token;
        var item = $scope.aktiviteter.splice(index, 1)[0];
        var id = item.id;
        elevAktivitetService.raderaNarvaro(id_token, id).then(function (status) {
            if (status === "error") {
                globalService.notify("Kunde inte radera närvaron, försök igen senare.", "danger");
            } else {
                globalService.notify("Närvaron har blivit raderad.", "success");
            }
        });
    };
    $scope.skickaElev = function (data) {
        var url = "/elev/aktivitet";
        globalService.skickaData(url, data).then(function (responses) {
            if (responses[0].status < 200 || responses[0].status > 299) {
                globalService.notify("Ett fel inträffade, aktiviteten kommer skickas automatiskt.", "info");
            } else {
                globalService.notify("Aktiviteten har skickats till handledaren.", "success");
            }
        });
    };
});

