module.controller("elevSeMomentCtrl", function ($scope, getMoment, globalService) {
    //Hämta & visa moment om inloggad
    if (globalService.isLoggedIn(true)) {
        var anvandare = JSON.parse(localStorage.anvandare);
        var id_token = anvandare.id_token;
        var promiseMoment = getMoment.getMoment(id_token);
        promiseMoment.then(function (data) {
            $scope.moment = data;
        });
    }
    //Siffror till ord
    $scope.getStatus = function (status) {
        if (status === 0)
            return "Icke avklarad";
        else if (status === 1)
            return "Väntande";
        else if (status === 2)
            return "Avklarad!";
        else if (status === 3)
            return "Nekad";
    };
    //Uppdatera moment
    $scope.setStatus = function (id) {
        var data = {
            "id": id
        };
        var url = "/elev/moment/avklara";
        globalService.skickaData(url, data).then(function (responses) {
            if (responses[0].status < 200 || responses[0].status > 299) {
                globalService.notify("Ett fel inträffade, datan kommer skickas automatiskt.", "info");
            } else {
                globalService.notify("Momentet har skickats.", "success");
                //Uppdatera status till "Väntande"
                var index = arrayObjectIndexOf($scope.moment, id, "moment_id");
                if (index > -1)
                    $scope.moment[index].godkand = 1;
            }
        });
    };
});