module.controller("larareNatverkCtrl", function ($scope, larareNatverkService, globalService) {
    if (globalService.isLoggedIn(true)) {
        var anvandare = JSON.parse(localStorage.anvandare);
        id_token = anvandare.id_token;
        larareNatverkService.getNatverk(id_token).then(function (data) {
            $scope.program = data;
        });
    }
});