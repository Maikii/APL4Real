/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

module.controller("handledareCtrl", function ($scope, $window, globalService, handledareService) {
    $scope.logout = function () {
        if (globalService.isLoggedIn(true, true)) {
            var anvandare = JSON.parse(localStorage.anvandare);
            anvandare.id_token = "";
            localStorage.anvandare = JSON.stringify(anvandare);
            $window.location.href = "#/logout";
        }
        else if (globalService.isLoggedIn(false, true)) {
            var anvandare = JSON.parse(localStorage.anvandare);
            anvandare.basic_auth = "";
            localStorage.anvandare = JSON.stringify(anvandare);
            $window.location.href = "/handledare";
        } else {
            $window.location.href = "#";
        }
    };
    
    if (!localStorage.settings) {
        localStorage.settings = JSON.stringify({});
    }
    $scope.settings = JSON.parse(localStorage.settings);
    if (!$scope.settings.language) {
        $scope.settings.language = "se";
        localStorage.settings = JSON.stringify($scope.settings);
    }
    $scope.changeLanguage = function () {
        var language = $scope.settings.language;
        if (language == "se") {
            $scope.settings.language = "en";
        } else if (language == "en") {
            $scope.settings.language = "se";
        }
        localStorage.settings = JSON.stringify($scope.settings);
    };
    $scope.getText = function (text) {
        return handledareService.getText(text);
    };
    $scope.getFlagUrl = function () {
        return handledareService.getFlagUrl();
    };

    globalService.kollaStorage().then(function (responses) {
        console.log(responses);
    });
});
