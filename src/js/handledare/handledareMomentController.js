module.controller("handledareMomentCtrl", function ($scope, handledareMomentService, globalService, handledareService) {
    $scope.getText = function (text) {
        return handledareService.getText(text);
    };
    $scope.handledareSeMoment = function () {
        if (globalService.isLoggedIn(false)) {
            var anvandare = JSON.parse(localStorage.anvandare);
            var promiseAllaMoment = handledareMomentService.handledareSeMoment(anvandare.basic_auth);
            promiseAllaMoment.then(function (data) {
                $scope.moments = data;
            });
        }
    };
    $scope.getStatus = function (status) {
        return handledareService.getText("status"+status);
    };
});