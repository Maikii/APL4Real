module.controller("elevCtrl", function ($scope, $window, globalService) {
    $scope.logout = function () {
        $window.location.href = globalService.logout();
    };
    //Försök skicka data som inte blivit skickad innan
    globalService.kollaStorage().then(function (responses) {
        console.log(responses);
    });
    //Initiera datum väljaren
    $(function () {
        $("#dateInput").datepicker({dateFormat: 'yy-mm-dd'});
    });
});

