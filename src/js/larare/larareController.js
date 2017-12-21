module.controller("larareCtrl", function ($scope, $window, globalService) {
    $scope.logout = function () {
        $window.location.href = globalService.logout();
    };
    //Skicka oskickat
    globalService.kollaStorage().then(function (responses) {
        console.log(responses);
    });
});

