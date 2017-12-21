module.controller("larareSeLoggCtrl", function ($scope, larareSeLoggService, larareService, globalService) {
    //Lägg till i scope för användning i template
    $scope.larareService = larareService;
    var id_token;
    //Hämta klasser om inloggad
    if (globalService.isLoggedIn(true)) {
        var anvandare = JSON.parse(localStorage.anvandare);
        id_token = anvandare.id_token;

        larareService.getKlasser(id_token).then(function (data) {
            $scope.klasser = data;
        });
    }
    //Hämta elever från klass
    $scope.getElever = function (klass_id) {
        //Spara vald klass
        larareService.setSetting('lastKlass', klass_id);
        larareService.getElever(id_token, klass_id).then(function (data) {
            $scope.elever = data;
        });
    };
    //Hämta loggböcker från vald elev
    $scope.getLogg = function (selected_elev) {
        larareSeLoggService.getLoggar(id_token, selected_elev).then(function (data) {
            console.log(data);
            $scope.loggar = data;
        });
    };
    //Visa/göm kommentarer
    $scope.show = function (e) {
        console.log("#" + e.$id + "_kommentarer");
        $(".kommentarContainer").not("#" + e.$id + "_kommentarer").slideUp();
        $("#" + e.$id + "_kommentarer").slideToggle();
    };
    $scope.getBildUrl = function (bild, storlek) {
        return globalService.getBildUrl(bild, storlek);
    };
});
