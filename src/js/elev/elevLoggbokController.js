/* global IMG_SERVER_URL */

//Global för att ändringar i $scope aldrig stannade kvar
var gbild;
module.controller("elevLoggbokCtrl", function ($scope, $window, elevLoggbokService, globalService) {
    //Se till att variablen privat blir sparad.
    var anvandare = JSON.parse(localStorage.anvandare);
    if (anvandare.loggprivat !== undefined) {
        $scope.privat = anvandare.loggprivat;
    } else {
        anvandare.loggprivat = false;
    }

    //Skicka loggboken
    $scope.postLogg = function () {
        var datum = $scope.datum;
        var innehall = $scope.text;
        var ljus = parseInt($scope.ljus);
        var privat = $scope.privat;
        if (!privat)
            privat = false;
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
                if (status == 201) { //Created
                    globalService.notify("Loggboken har skickats.", "success");
                } else if (status == 401) { //Forbidden
                    globalService.notify("Du verkar inte vara inloggad längre. Försök logga in igen", "danger");
                } else { //Okänt fel
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
    //Spara checkboxen
    $scope.updatePrivat = function () {
        anvandare.loggprivat = $scope.privat;
        localStorage.anvandare = JSON.stringify(anvandare);
    };
    //Välj röd/gul/grön
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
    //Hantera svar från bilduppladdning
    $scope.onImgUrl = function (responseText, statusText, xhr, $form) {
        var response;
        try {
            response = JSON.parse(responseText);
        } catch (e) {
            response = responseText;
        }
        gbild = response.filename;
        $("#loggimg").attr("src", $scope.getBildUrl(gbild, 600));
    };
    $scope.getBildUrl = function (bild, storlek) {
        return globalService.getBildUrl(bild, storlek);
    };
    window.onImgUrl = $scope.onImgUrl;
    globalService.kollaStorage().then(function (responses) {
        //console.log(responses);
    });
    $(function () {
        $("#dateInput").datepicker({dateFormat: 'yy-mm-dd'});
    });
});

