/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.controller("larareCtrl", function ($scope, $window, getService, postService, globalService) {
    $scope.logout = function () {
        var anvandare = JSON.parse(localStorage.anvandare);
        anvandare.id_token = "";
        localStorage.anvandare = JSON.stringify(anvandare);
        $window.location.href = "#/logout";
    };
    $scope.getPeople = function () {
        var id_token = JSON.parse(localStorage.anvandare).id_token;
        getService.getElever(id_token).then(function (data) {
            $scope.elever = data;
        });
        getService.getHandledare(id_token).then(function (data) {
            $scope.handledare = data;
        });
    };
    $scope.kopplaElevHandledare = function () {
        var id_token = JSON.parse(localStorage.anvandare).id_token;
        var elever = $scope.elever;
        var array = [];
        for (var i = 0; i < elever.length; i++) {
            if (elever[i].ny_handledare !== elever[i].handledare_ID)
            {
                array.push({
                    "elev_id": elever[i].ID,
                    "handledare_id": elever[i].ny_handledare
                });
            }
        }
        if (array.length > 0)
        {
            postService.updateElevHandledare(array).then(function (responses) {
                console.log(responses);
            });
        }
    };
    globalService.kollaStorage().then(function (responses) {
        console.log(responses);
    });
});

