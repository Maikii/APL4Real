module.controller("elevNarvaroCtrl", function ($scope, globalService) {
    //Se till att användaren är inloggad, visar upp ett fel annars
    globalService.isLoggedIn(true);
    $scope.skickaNarvaro = function () {
        var datum = $scope.datum;
        var trafikljus = $scope.ljus;
        var data = {
            "trafikljus": trafikljus,
            "datum": datum
        };

        if (datum && trafikljus > -1) {
            var url = "/elev/narvaro";
            globalService.skickaData(url, data)
                    .then(function (responses) {
                        var status = responses[0].status;
                        if (status == 200) { //Success
                            globalService.notify("Närvaron har skickats.", "success");
                        } else if (status == 401) { //Forbidden
                            globalService.notify("Du verkar inte vara inloggad längre. Försök logga in igen", "danger");
                        } else { //Okänt fel
                            globalService.notify("Närvaron kommer skickas automatiskt.", "info");
                        }
                    });
        } else {
            globalService.notify("Du måste fylla i datum och närvaro av dagen.", "danger");
        }
    };
    //Välj färg & omvandla till siffror
    $scope.getLjus = function (ljus) {
        if (ljus === "rod")
            $scope.ljus = 0;
        else if (ljus === "gul")
            $scope.ljus = 1;
        else
            $scope.ljus = 2;
        $(".vald").removeClass("vald");
        $("." + ljus).addClass("vald");
    };
});