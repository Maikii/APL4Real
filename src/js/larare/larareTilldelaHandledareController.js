module.controller("larareTilldelaHandledareCtrl", function ($scope, $window, larareService, globalService) {
    //Lägg till i scope för användning i template
    $scope.larareService = larareService;
    var id_token;
    //Hämta & visa klasser/program/handledare
    if (globalService.isLoggedIn(true)) {
        var anvandare = JSON.parse(localStorage.anvandare);
        id_token = anvandare.id_token;

        larareService.getKlasser(id_token).then(function (data) {
            $scope.klasser = data;
        });
        larareService.getProgram().then(function (data) {
            $scope.program_list = data;
        });
        larareService.getHL(id_token).then(function (data) {
            var handledare = [{
                    id: null,
                    namn_foretag: "Ingen Handledare"
                }];
            handledare = handledare.concat(data);
            $scope.handledare = handledare;
        });
    }
    //Hämta & visa elever i vald klass
    $scope.getElever = function (klass_id) {
        larareService.setSetting('lastKlass', klass_id);
        larareService.getElever(id_token, klass_id).then(function (data) {
            $scope.elever = data;
        });
    };
    //Hämta & visa handledare i valt program
    $scope.getHandledarePerProgram = function (program) {
        //Spare valt program
        larareService.setSetting('lastProgram', program);
        if (program > 0) {
            larareService.getHLPP(id_token, program).then(function (data) {
                var handledare = [{
                        id: null,
                        namn_foretag: "Ingen Handledare"
                    }];
                handledare = handledare.concat(data);
                var copy = [].concat($scope.elever);
                $scope.elever = [];
                $scope.handledare = handledare;
                //Selected handledare blir null om man bygger handledare lista
                //Så vi kopierar den gamla och sätter tillbaka den efteråt
                setTimeout(function () {
                    $scope.elever = copy;
                    $scope.$apply();
                }, 150);
            });
        }
    };
    //Skicka tilldelning av handledare
    $scope.kopplaElevHandledare = function () {
        var elever = $scope.elever;
        var array = [];
        //Leta efter ändringar i varje elev
        for (var i = 0; i < elever.length; i++) {
            //Spara dem som ändrats
            if (elever[i].ny_handledare !== elever[i].hl_id)
            {
                array.push({
                    "elev_id": elever[i].id,
                    "handledare_id": elever[i].ny_handledare
                });
                elever[i].hl_id = elever[i].ny_handledare;
            }
        }
        //Om vi hittat några som ändrats, skicka
        if (array.length > 0) {
            var targetUrl = "/larare/koppla";
            globalService.skickaData(targetUrl, array).then(function (responses) {
                if (responses[0].status < 200 || responses[0].status > 299) {
                    globalService.notify("Ett fel inträffade, datan kommer skickas automatiskt.", "info");
                } else {
                    globalService.notify("Elevernas handledare har uppdaterats.", "success");
                }
            });
        }
    };
});

