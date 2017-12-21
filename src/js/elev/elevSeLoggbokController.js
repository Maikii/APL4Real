/* global IMG_SERVER_URL */

module.controller("elevSeLoggCtrl", function ($scope, getServiceLoggar, globalService) {
    //Hämta & visa loggböcker om inloggad
    if (globalService.isLoggedIn(true)) {
        var anvandare = JSON.parse(localStorage.anvandare);
        var id_token = anvandare.id_token;
        getServiceLoggar.getLoggar(id_token).then(function (data) {
            console.log(data);
            $scope.loggar = data;
        });
    }
    //Visa/Dölj kommentarer
    $scope.show = function (e) {
        console.log("#" + e.$id + "_kommentarer");
        $(".kommentarContainer").not("#" + e.$id + "_kommentarer").slideUp();
        $("#" + e.$id + "_kommentarer").slideToggle();
    };
    $scope.getBildUrl = function (bild, storlek) {
        return globalService.getBildUrl(bild, storlek);
    };
});
