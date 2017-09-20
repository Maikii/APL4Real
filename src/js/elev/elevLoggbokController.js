/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
//global för att ändringar i $scope aldrig stannade kvar
var gbild;
module.controller("elevLoggbokCtrl", function ($scope, $window, elevLoggbokService, globalService) {
    if (window.location.hash.includes("elev_loggbok"))
        globalService.isLoggedIn(true);
    $scope.logout = function () {
        if (!localStorage.anvandare)
            $window.location.href = "#";
        else {
            var anvandare = JSON.parse(localStorage.anvandare);
            anvandare.id_token = "";
            localStorage.anvandare = JSON.stringify(anvandare);
            $window.location.href = "#/logout";
        }
    };
    $scope.postLogg = function () {
        //Göra om till databasens Date
        var datum = $scope.datum;
        var innehall = $scope.text;
        var ljus = parseInt($scope.ljus);
        var privat = $scope.privat || false;
        var bild = gbild;
        if (!bild)
            bild = null;
        if (datum && innehall && ljus >= 0 && innehall.length <= 1024) {
            var targetUrl = "/elev/logg";
            var data = {
                "datum": datum,
                "innehall": innehall,
                "ljus": ljus,
                "imgUrl": bild,
                "privat": privat
            };
            globalService.skickaData(targetUrl, data).then(function (responses) {
                var status = responses[0].status;
                if (status == 201) {
                    globalService.notify("Loggboken har skickats.", "success");
                } else if (status == 401) {
                    globalService.notify("Du verkar inte vara inloggad längre. Försök logga in igen", "danger");
                } else {
                    globalService.notify("Loggboken kommer skickas automatiskt.", "info");
                }
                gbild = undefined;
                $("#loggimg").attr("src", "");
                $scope.datum = "";
                $scope.text = "";
                $scope.ljus = "";
            });
        } else if (innehall.length > 1024) {
            globalService.notify("Loggboken är för lång. (Över 1024 tecken)", "danger");
        } else {
            globalService.notify("Du måste fylla i datum, innehåll och upplevelse av dagen.", "danger");
        }
    };
    $scope.valj = function (ljus) {
        if (ljus === "rod")
            $scope.ljus = 0;
        else if (ljus === "gul")
            $scope.ljus = 1;
        else
            $scope.ljus = 2;
        $(".vald").removeClass("vald");
        $("." + ljus).addClass("vald");
    };
    $scope.onImgUrl = function (responseText, statusText, xhr, $form) {
        var response;
        try{
            response = JSON.parse(responseText);
        } catch(e) {
            response = responseText;
        }
        gbild = response.filename;
        $("#loggimg").attr("src", $scope.getBildUrl("\"" + gbild + "\"", 600));
    };
    $scope.getBildUrl = function (bild, storlek) {
        //tar bort citattecknen som kommer vem fan vet var ifrån
        bild = bild.substr(1, bild.length - 2);
        if (storlek)
            return IMG_SERVER_URL + "?file=" + bild + "&size=" + storlek;
        else
            return IMG_SERVER_URL + "?file=" + bild;
    };
    window.onImgUrl = $scope.onImgUrl;
    globalService.kollaStorage().then(function (responses) {
        //console.log(responses);
    });
    $(function () {
        $("#dateInput").datepicker({dateFormat: 'yy-mm-dd'});
    });
});

