module.controller("larareTilldelaMomentCtrl", function ($scope, larareService, larareMomentService, globalService) {
    //Lägg till i scope för användning i template
    $scope.larareService = larareService;
    var id_token;
    //Hämta klasser om inloggad
    if (globalService.isLoggedIn(true)) {
        var anvandare = JSON.parse(localStorage.anvandare);
        id_token = anvandare.id_token;
        larareService.getKlasser(id_token).then(function (data) {
            $scope.klasser = data;
        });
    }
    //Hämta & visa elever i vald klass
    $scope.getElever = function (klass_id) {
        //Spara vald klass
        larareService.setSetting('lastKlass', klass_id);
        larareService.getElever(id_token, klass_id).then(function (data) {
            $scope.elever = data;
        });
    };
    //Hämta användarens moment
    $scope.getMoment = function () {
        larareMomentService.getMomentLärare(id_token).then(function (data) {
            $scope.momentlista = data;
        });
    };
    //Skicka tilldelning av moment
    $scope.submit = function () {
        var elever = [];
        var momenten = [];
        //Spara de elever som har sin checkbox ifylld
        for (var i = 0; i < $scope.elever.length; i++) {
            var elev = $scope.elever[i];
            if (elev.checkbox) {
                elever.push({
                    elev_id: elev.id
                });
            }
        }
        //Spara de moment som har sin checkbox ifylld
        for (var i = 0; i < $scope.momentlista.length; i++) {
            var moment = $scope.momentlista[i];
            if (moment.checkbox) {
                momenten.push({
                    moment_id: moment.id
                });
            }
        }
        //Om vi har något i båda grupper, skicka
        if (elever.length && momenten.length) {
            var data = {
                moment: momenten,
                elever: elever
            };
            var url = "/larare/moment/tilldela";

            globalService.skickaData(url, data).then(function (responses) {
                if (responses[0].status < 200 || responses[0].status > 299) {
                    globalService.notify("Ett fel inträffade, datan kommer skickas automatiskt.", "info");
                } else {
                    globalService.notify("Tilldelningen lyckades.", "success");
                }
            });
        }
    };
});