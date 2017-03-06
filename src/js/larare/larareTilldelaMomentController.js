/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

module.controller("larareTilldelaMomentCtrl", function ($scope, larareService, larareMomentService, globalService) {
    $scope.larareService = larareService;
    var id_token;
    if (globalService.isLoggedIn(true)) {
        var anvandare = JSON.parse(localStorage.anvandare);
        id_token = anvandare.id_token;
        larareService.getKlasser(id_token).then(function (data) {
            $scope.klasser = data;
        });
    }
    $scope.getElever = function (klass_id) {
        larareService.setSetting('lastKlass', klass_id);
        larareService.getElever(id_token, klass_id).then(function (data) {
            $scope.elever = data;
        });
    };
    $scope.getMoment = function () {
        larareMomentService.getMomentLärare(id_token).then(function (data) {
            $scope.momentlista = data;
        });
    };
    $scope.submit = function () {
        var elever = [];
        var momenten = [];
        for (var i = 0; i < $scope.elever.length; i++)
        {
            var elev = $scope.elever[i];
            if (elev.checkbox) {
                elever.push({
                    elev_id: elev.id
                });
            }
        }
        for (var i = 0; i < $scope.momentlista.length; i++)
        {
            var moment = $scope.momentlista[i];
            if (moment.checkbox) {
                momenten.push({
                    moment_id: moment.id
                });
            }
        }
        if (elever.length && momenten.length)
        {
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
function arrayObjectIndexOf(myArray, searchTerm, property) {
    for (var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property] === searchTerm)
            return i;
    }
    return -1;
}