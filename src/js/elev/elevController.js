/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
//global för att ändringar i $scope aldrig stannade kvar
var gbild;
module.controller("elevCtrl", function ($scope, $window, elevLoggbokService, globalService) {
    $scope.logout = function () {
        if (globalService.isLoggedIn(true, true)) {
            var anvandare = JSON.parse(localStorage.anvandare);
            anvandare.id_token = "";
            localStorage.anvandare = JSON.stringify(anvandare);
            $window.location.href = "#/logout";
        }
        else if (globalService.isLoggedIn(false, true)) {
            localStorage.anvandare = "";
            $window.location.href = "#";
        } else {
            $window.location.href = "#";
        }
    };
    globalService.kollaStorage().then(function (responses) {
        console.log(responses);
    });
    $(function () {
        $("#dateInput").datepicker({dateFormat: 'yy-mm-dd'});
    });
});

