//Används i elev / lärare se loggböcker
module.controller("kommentarCtrl", function ($scope, globalService) {
    $scope.nyaKommentarer = [];
    $scope.postKommentar = function (logg_id) {
        //Hämta kommentaren
        var kommentar = document.getElementById(logg_id).value.trim();
        if (kommentar !== "") {
            //Dagens datum
            var datumObj = new Date();
            var datum = datumObj.getFullYear() + "-"
                    + (datumObj.getMonth() + 1) + "-"
                    + datumObj.getDate() + " "
                    + datumObj.getHours() + ":"
                    + ('0' + datumObj.getMinutes()).slice(-2);

            var data = {
                "loggbok_id": logg_id,
                "innehall": kommentar,
                "datum": datum
            };

            var url = "/kommentar";
            globalService.skickaData(url, data).then(function (responses) {
                if (responses[0].status < 200 || responses[0].status > 299) {
                    globalService.notify("Ett fel inträffade, datan kommer skickas automatiskt.", "info");
                } else {
                    globalService.notify("Kommentaren har skickats.", "success");
                    //Visa den nya kommentaren
                    $scope.nyaKommentarer.push({
                        namn: "Du",
                        innehall: kommentar,
                        datum: datum
                    });
                }
            });
            //Ta bort texten som skrevs
            document.getElementById(logg_id).value = "";
        }
    };
});
