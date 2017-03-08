/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.controller("larareSettingsCtrl", function ($scope, $window, globalService, registrationService) {
    var id_token;
    if (globalService.isLoggedIn(true)) {
        registrationService.getKlasser().then(function (data) {
            $scope.klasser = data;
        });
        $scope.oskickat = [];
        if (localStorage.oskickat)
            $scope.oskickat = JSON.parse(localStorage.oskickat);
    }
    $scope.changeKlass = function (klass_id) {
        var targetUrl = "/larare/klasschange";
        var data = {klass_id: klass_id};
        globalService.skickaData(targetUrl, data).then(function (responses) {
            if (responses[0].status < 200 || responses[0].status > 299) {
                globalService.notify("Ett fel inträffade, datan kommer skickas automatiskt.", "info");
            } else {
                globalService.notify("Du har bytt klass.", "success");
            }
        });
    };
    $scope.raderaOskickat = function (item) {
        var index = $scope.oskickat.indexOf(item);
        if (index > -1)
            $scope.oskickat.splice(index, 1);
        localStorage.oskickat = JSON.stringify($scope.oskickat);
    }
});

