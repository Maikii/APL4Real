/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.controller("loginCtrl", function ($location, $window, $scope, loginService, globalService) {
    $scope.googleLogin = function (googleAnvandare) {
        var id_token = googleAnvandare.getAuthResponse().id_token;
        var expires_at = googleAnvandare.getAuthResponse().expires_at;
        setTimeout(function () {
            $location.reload();
        }, expires_at - Date.now());
        var google_id = googleAnvandare.getBasicProfile().getId();
        loginService.logInGoogle(id_token).then(function (data) {
            if (data.behorighet === 0) {
                globalService.notify("Inloggad som elev", "info");
                var anvandare = {
                    id_token: id_token,
                    google_id: google_id,
                    behorighet: 0,
                    expires_at: expires_at
                };
                localStorage.anvandare = JSON.stringify(anvandare);
                if (location.hash.length < 3)
                    location.hash = "#/elev";
            } else if (data.behorighet === 1) {
                globalService.notify("Inloggad som lärare", "info");
                var anvandare = {
                    id_token: id_token,
                    google_id: google_id,
                    behorighet: 1,
                    expires_at: expires_at
                };
                localStorage.anvandare = JSON.stringify(anvandare);
                if (location.hash.length < 3)
                    location.hash = "#/larare";
            } else if (data.behorighet === -1) {
                location.hash = "#/registration";
            } else {
                globalService.notify("Ett okänt fel inträffade vid inloggningen, försök igen senare eller kontakta administratören.", "danger");
                console.log(data);
            }
        });
    };
    $scope.handledareInit = function () {
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
        loginService.logInHandledare(anvandarnamn, losenord).then(function (status) {
            if (status === 200) {
                globalService.notify("Inloggad som handledare", "info");
                var anvandare = {
                    anvandarnamn: anvandarnamn,
                    basic_auth: "Basic " + btoa(anvandarnamn + ":" + losenord),
                    behorighet: 2
                };
                localStorage.anvandare = JSON.stringify(anvandare);
                window.location.href = "../index.html#/handledare";
            } else if (status === 401) {
                globalService.notify("Fel användarnamn eller lösenord.", "danger");
            } else {
                globalService.notify("Ett okänt fel inträffade vid inloggningen, \n\
försök igen senare eller kontakta administratören. (" + status + ")", "danger");
                console.log(status);
            }
        });
    };
    $scope.checkLogin = function (googleAnvandare) {
        if (localStorage.anvandare) {
            if (JSON.parse(localStorage.anvandare).expires_at) {
                if (JSON.parse(localStorage.anvandare).expires_at > Date.now()) {
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
        $scope.googleLogin(googleAnvandare);
    };
    window.onSignIn = $scope.checkLogin;
});

