/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.controller("handledareKontaktCtrl", function ($scope, handledareKontaktService, globalService, handledareService) {
    $scope.getText = function (text) {
        return handledareService.getText(text);
    };
    if (globalService.isLoggedIn(false)) {
        var anvandare = JSON.parse(localStorage.anvandare);
        var basic_auth = anvandare.basic_auth;
        var promiseLoggar = handledareKontaktService.getKontakt(basic_auth);
        promiseLoggar.then(function (data) {
            $scope.kontakter = data;
        });
    }
});

