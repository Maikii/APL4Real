module.controller("handledareAktivitetCtrl", function ($scope, $window, handledareAktivitetService, globalService, handledareService) {
    //Hämta text för det språk som är valt
    $scope.getText = function (text) {
        return handledareService.getText(text);
    };
    //Siffror till text
    $scope.parseLjus = function (i) {
        if (i === 0)
            return $scope.getText("narvaro2a");
        else if (i === 1)
            return $scope.getText("narvaro2b");
        else if (i === 2)
            return $scope.getText("narvaro2c");
    };
    //Siffror till text
    $scope.parseRubrik = function (i) {
        if (i === 0)
            return $scope.getText("narvaroTitle");
        else if (i === 1)
            return $scope.getText("loggbokTitle");
        else if (i === 2)
            return $scope.getText("momentTitle");
    };
    $scope.getBildUrl = function (bild, storlek) {
        return globalService.getBildUrl(bild, storlek);
    };
    //Hämta & visar aktiviteter om inloggad
    $scope.getHandledareAktiviteter = function () {
        //Inloggad? (ej google)
        if (globalService.isLoggedIn(false)) {
            var basic_auth = JSON.parse(localStorage.anvandare).basic_auth;
            //Hämta elever
            handledareService.getElever(basic_auth).then(function (elever) {
                //Hämta aktiviteter
                handledareAktivitetService.getHandledareAktiviteter(basic_auth).then(function (data) {
                    //Loopa aktivitetsgrupper
                    for (var i = 0; i < data.length; i++)
                        //Loopa igenom varje aktivitet i gruppen
                        for (var j = 0; j < data[i].length; j++)
                            //Leta igenom elever tills aktivitetens ägare hittas
                            for (var k = 0; k < elever.length; k++)
                                //Kopiera namnet från elev till aktiviteten
                                if (elever[k].id === data[i][j].elev_id)
                                    data[i][j].namn = elever[k].namn;
                    $scope.aktiviteter = data;
                });
            });
        }
    };
    //Visa / Dölj valda aktiviteter
    $scope.show = function (e) {
        $(".aktivitet").not("#" + e.$id).slideUp();
        $("#" + e.$id).slideToggle();
    };
    //Hantera aktiviteter
    $scope.godkann = function (groupIndex, aktivitetIndex) {
        var item = $scope.aktiviteter[groupIndex].splice(aktivitetIndex, 1)[0];
        $scope.skickaHandledare(item, 1);
    };
    $scope.neka = function (groupIndex, aktivitetIndex) {
        var item = $scope.aktiviteter[groupIndex].splice(aktivitetIndex, 1)[0];
        $scope.skickaHandledare(item, 2);
    };
    $scope.skickaHandledare = function (item, godkant) {
        var url = "/handledare/aktivitet";
        var data = {
            id: item.id,
            typ: item.typ,
            godkant: godkant
        };

        globalService.skickaData(url, data).then(function (responses) {
            var status = responses[0].status;
            if (status == 200) { //Success
                if (godkant === 1)
                    globalService.notify($scope.getText("confirmSuccess"), "success");
                else if (godkant === 2)
                    globalService.notify($scope.getText("declineSuccess"), "success");
            } else { //Okänt fel
                globalService.notify($scope.getText("defaultFailure"), "info");
            }
        });
    };
});

