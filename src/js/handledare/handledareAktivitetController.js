/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


module.controller("handledareAktivitetCtrl", function ($scope, $window, handledareAktivitetService, globalService, handledareService) {
    $scope.getText = function (text) {
        return handledareService.getText(text);
    };
    $scope.getElevName = function (id) {
        return handledareService.getElevName(id);
    };
    $scope.parseLjus = function (i) {
        if (i === 0)
            return $scope.getText("narvaro2a");
        else if (i === 1)
            return $scope.getText("narvaro2b");
        else if (i === 2)
            return $scope.getText("narvaro2c");
    };
    $scope.parseRubrik = function (i) {
        if (i === 0)
            return $scope.getText("narvaroTitle");
        else if (i === 1)
            return $scope.getText("loggbokTitle");
        else if (i === 2)
            return $scope.getText("momentTitle");
    };
    $scope.getBildUrl = function (bild, storlek) {
        //tar bort citattecknen som kommer vem fan vet var ifrån
        bild = bild.substr(1, bild.length - 2);
        if (storlek)
            return IMG_SERVER_URL + "?file=" + bild + "&size=" + storlek;
        else
            return IMG_SERVER_URL + "?file=" + bild;
    };
    $scope.getHandledareAktiviteter = function () {
        if (globalService.isLoggedIn(false)) {
            var basic_auth = JSON.parse(localStorage.anvandare).basic_auth;
            handledareService.getElever(basic_auth).then(function (elever) {
                handledareAktivitetService.getHandledareAktiviteter(basic_auth).then(function (data) {
                    for (var i = 0; i < data.length; i++)//loopa grupper
                        for (var j = 0; j < data[i].length; j++)//varje aktivitet
                            for (var k = 0; k < elever.length; k++)//alla dina elever
                                if (elever[k].id == data[i][j].elev_id)//ta namnet
                                    data[i][j].namn = elever[k].namn;
                    $scope.aktiviteter = data;
                });
            });
        }
    };
    $scope.show = function (e) {
        $(".aktivitet").not("#" + e.$id).slideUp();
        $("#" + e.$id).slideToggle();
    };
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
            if (responses[0].status < 200 || responses[0].status > 299) {
                globalService.notify("Ett fel inträffade, datan kommer skickas automatiskt.", "info");
            }
        });
    };
});

