module.controller("elevSeMomentCtrl", function ($scope, getMoment, globalService) {
    if (globalService.isLoggedIn(true)) {
        var anvandare = JSON.parse(localStorage.anvandare);
        var id_token = anvandare.id_token;
        var promiseMoment = getMoment.getMoment(id_token);
        promiseMoment.then(function (data) {
            $scope.moment = data;
        });
    }
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
                var index = arrayObjectIndexOf($scope.moment, id, "moment_id");
                if(index > -1)
                    $scope.moment[index].godkand = 1;
            }
        });
    };

    $scope.Status = function (id) {
        if (id === 0) {
            return true;
        } else {
            return false;
        }
    };

});

function arrayObjectIndexOf(myArray, searchTerm, property) {
    for (var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property] === searchTerm)
            return i;
    }
    return -1;
}