module.controller("elevSeMomentCtrl", function ($scope, getMoment, globalService) {
    var anvandare = JSON.parse(localStorage.anvandare);
    var id_token = anvandare.id_token;
    var promiseMoment = getMoment.getMoment(id_token);
    promiseMoment.then(function (data) {
        $scope.moment = data;
    });

    $scope.getStatus = function (status) {
        if (status === 0)
            return "Icke avklarad";
        else if (status === 1)
            return "Väntande";
        else if (status === 2)
            return "Avklarad!";

    };


    $scope.setStatus = function (id) {
        console.log(id);
        var data = {
            "id": id
        };
        globalService.skickaData(url, data).then(function (responses) {
            if (responses[0].status < 200 || responses[0].status > 299) {
                globalService.notify("Ett fel inträffade, datan kommer skickas automatiskt.", "info");
            }
        });
    };

    $scope.Status = function (id) {
        if (id === 0) {
            return true;
        } else{
            return false;
        }
    };

});
