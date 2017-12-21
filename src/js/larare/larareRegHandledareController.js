module.controller("larareRegHandledareCtrl", function ($scope, larareService, globalService) {
    //Hämta program om inloggad
    if (globalService.isLoggedIn(true)) {
        larareService.getProgram().then(function (data) {
            $scope.programs = data;
        });
    }
    //Registrera
    $scope.registreraHandledare = function () {
        //Om undefined, bli tom
        var anvandarnamn = $scope.username || "";
        var losenord = $scope.password || "";
        var email = $scope.email || "";
        var tfnr = $scope.phone || "";
        var namn = $scope.name || "";
        var foretag = $scope.frtg || "";
        var program = parseInt($scope.pr || -1);
        var url = "/apl/handledare/registrera";
        var data = {
            anvandarnamn: anvandarnamn,
            losenord: losenord,
            email: email,
            tfnr: tfnr,
            namn: namn,
            foretag: foretag,
            program_id: program
        };
        //Se till att allt är ifyllt
        if (anvandarnamn.length > 0 && losenord.length > 0 && email.length > 0
                && tfnr.length > 0 && namn.length > 0 && foretag.length > 0
                && program > -1) {
            globalService.skickaData(url, data).then(function (responses) {
                if (responses[0].status < 200 || responses[0].status > 299) {
                    globalService.notify("Ett fel inträffade, datan kommer skickas automatiskt.", "info");
                } else {
                    globalService.notify("Din handledare har blivit registrerad.", "success");
                    //Töm alla fält
                    $scope.username = "";
                    $scope.password = "";
                    $scope.email = "";
                    $scope.phone = "";
                    $scope.name = "";
                    $scope.frtg = "";
                    $scope.pr = -1;
                }
            });
        } else {
            globalService.notify("Skriv in all data.", "info");
        }
    };
});
