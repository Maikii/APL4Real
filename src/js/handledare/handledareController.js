module.controller("handledareCtrl", function ($scope, $window, globalService, handledareService) {
    $scope.logout = function () {
        $window.location.href = globalService.logout();
    };
    //Språkval
    if (!localStorage.settings) {
        localStorage.settings = JSON.stringify({});
    }
    $scope.settings = JSON.parse(localStorage.settings);
    if (!$scope.settings.language) {
        $scope.settings.language = "se";
        localStorage.settings = JSON.stringify($scope.settings);
    }
    $scope.changeLanguage = function () {
        //Byt mellan språk
        var language = $scope.settings.language;
        if (language === "se") {
            $scope.settings.language = "en";
        } else if (language === "en") {
            $scope.settings.language = "se";
        }
        //Spara språkval
        localStorage.settings = JSON.stringify($scope.settings);
    };
    //Hämta text för det språk som är valt
    $scope.getText = function (text) {
        return handledareService.getText(text);
    };
    $scope.getFlagUrl = function () {
        return handledareService.getFlagUrl();
    };
    //Skicka oskickat
    globalService.kollaStorage().then(function (responses) {
        console.log(responses);
    });
});
