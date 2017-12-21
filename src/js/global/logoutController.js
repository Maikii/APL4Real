module.controller("logoutCtrl", function ($window) {
    var anvandare = JSON.parse(localStorage.anvandare);
    delete anvandare.id_token;
    delete anvandare.google_id;
    delete anvandare.expires_at;
    localStorage.anvandare = JSON.stringify(anvandare);
    window.onSignOut = function () {
        var auth2 = gapi.auth2.getAuthInstance();
        console.log(auth2);
        auth2.signOut().then(function () {
            //Flytta till starsidan efter utloggning
            $window.location.href = "#/";
        });
    };
});