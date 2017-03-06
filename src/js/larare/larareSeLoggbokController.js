/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.controller("larareSeLoggCtrl", function ($scope, larareSeLoggService, larareService, globalService) {
    $scope.larareService = larareService;
    var id_token;
    if (globalService.isLoggedIn(true)) {
        var anvandare = JSON.parse(localStorage.anvandare);
        id_token = anvandare.id_token;

        larareService.getKlasser(id_token).then(function (data) {
            $scope.klasser = data;
        });
    }
    $scope.getElever = function (klass_id) {
        larareService.setSetting('lastKlass', klass_id);
        larareService.getElever(id_token, klass_id).then(function (data){
            $scope.elever = data;
        });
    };
    $scope.getLogg = function (selected_elev) {
        larareSeLoggService.getLoggar(id_token, selected_elev).then(function (data) {
            console.log(data);
            $scope.loggar = data;
        });
    };
    $scope.show = function (e) {
        console.log("#" + e.$id + "_kommentarer");
        $(".kommentarContainer").not("#" + e.$id + "_kommentarer").slideUp();
        $("#" + e.$id + "_kommentarer").slideToggle();
    };
    $scope.getBildUrl = function (bild, storlek) {
        //tar bort citattecknen som kommer vem fan vet var ifrån
        bild = bild.substr(1, bild.length - 2);
        if (storlek)
            return IMG_SERVER_URL + "?file=" + bild + "&size=" + storlek;
        else
            return IMG_SERVER_URL + "?file=" + bild;
    };
});
