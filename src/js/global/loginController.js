module.controller("loginCtrl", function ($location, $window, $scope, loginService, globalService) {
    $scope.googleLogin = function (googleAnvandare) {
        //Används i backend för att få fram vilken användare det är
        var id_token = googleAnvandare.getAuthResponse().id_token;
        //Id_token är tidsbegränsad
        var expires_at = googleAnvandare.getAuthResponse().expires_at;
        //Ladda om när tiden gått ut
        setTimeout(function () {
            $location.reload();
        }, expires_at - Date.now());
        //Används i skickaData
        var google_id = googleAnvandare.getBasicProfile().getId();
        loginService.logInGoogle(id_token).then(function (data) {
            //Elev
            if (data.behorighet === 0) {
                globalService.notify("Inloggad som elev", "info");
                var anvandare = {
                    id_token: id_token,
                    google_id: google_id,
                    behorighet: 0,
                    expires_at: expires_at
                };
                localStorage.anvandare = JSON.stringify(anvandare);
                //Flytta till elevsidan om man är på startsidan
                if (location.hash.length < 3)
                    location.hash = "#/elev";
                //Lärare
            } else if (data.behorighet === 1) {
                globalService.notify("Inloggad som lärare", "info");
                var anvandare = {
                    id_token: id_token,
                    google_id: google_id,
                    behorighet: 1,
                    expires_at: expires_at
                };
                localStorage.anvandare = JSON.stringify(anvandare);
                //Flytta till läraresidan om man är på startsidan
                if (location.hash.length < 3)
                    location.hash = "#/larare";
                //Ej registrerad
            } else if (data.behorighet === -1) {
                //Flytta till registreringssidan
                location.hash = "#/registration";
            } else {
                globalService.notify("Ett okänt fel inträffade vid inloggningen, försök igen senare eller kontakta administratören.", "danger");
                console.log(data);
            }
        });
    };
    $scope.handledareInit = function () {
        //Fyll i användarnamn & töm lösenordet
        if (localStorage.anvandare) {
            $scope.username = JSON.parse(localStorage.anvandare).anvandarnamn;
            var anvandare = JSON.parse(localStorage.anvandare);
            anvandare.basic_auth = "";
            localStorage.anvandare = JSON.stringify(anvandare);
        } else {
            localStorage.anvandare = JSON.stringify({});
        }
    };
    $scope.handledareLogin = function () {
        var anvandarnamn = $scope.username;
        var losenord = $scope.password;
        //Hantera handledareinloggningen
        loginService.logInHandledare(anvandarnamn, losenord).then(function (status) {
            if (status === 200) { //Success
                globalService.notify("Inloggad som handledare", "info");
                //Kryptera & spara auth medans inloggad
                var anvandare = {
                    anvandarnamn: anvandarnamn,
                    basic_auth: "Basic " + btoa(anvandarnamn + ":" + losenord),
                    behorighet: 2
                };
                localStorage.anvandare = JSON.stringify(anvandare);
                window.location.href = "../index.html#/handledare";
            } else if (status === 401) { //Forbidden
                globalService.notify("Fel användarnamn eller lösenord.", "danger");
            } else { //Okänt fel
                globalService.notify("Ett okänt fel inträffade vid registreringen, \n"
                        + "försök igen senare eller kontakta administratören. "
                        + "(" + status + ")", "danger");
                console.log(status);
            }
        });
    };
    //Loggat in i google
    $scope.checkLogin = function (googleAnvandare) {
        //Kolla om användaren behöver initieras
        if (localStorage.anvandare) {
            if (JSON.parse(localStorage.anvandare).expires_at) {
                if (JSON.parse(localStorage.anvandare).expires_at > Date.now()) {
                    //Flytta till rätt sida om användaren är på startsidan
                    if ($location.path() === "/") {
                        var behorighet = JSON.parse(localStorage.anvandare).behorighet;
                        if (behorighet === 0)
                            $window.location.href = "#/elev";
                        else if (behorighet === 1)
                            $window.location.href = "#/larare";
                    }
                    return;
                }
            }
        }
        //Initiera
        $scope.googleLogin(googleAnvandare);
    };
    window.onSignIn = $scope.checkLogin;
});

