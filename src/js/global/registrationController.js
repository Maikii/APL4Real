module.controller("registrationCtrl", function ($scope, $window, $location, registrationService, globalService) {
    $scope.id_token = "";
    //Hämta klasser
    registrationService.getKlasser().then(function (data) {
        $scope.klasser = data;
        console.log(data);
    });
    //Registrera användaren
    $scope.postRegistration = function () {
        var google_id = $scope.id_token;
        var namn = $scope.nmn;
        var klass = $scope.kl;
        var tfnr = $scope.tfl;
        console.log(google_id, namn, klass, tfnr);
        if (google_id !== "") {
            //Använder inte skickaData för den kräver att man är inloggad
            registrationService.postRegistration(google_id, namn, klass, tfnr).then(function (status) {
                if (status === 201) { //Created
                    globalService.notify("Registrad!", "success");
                    //Flytta till startsidan
                    $location.path('/');
                } else { //Okänt fel
                    globalService.notify("Ett okänt fel inträffade vid registreringen, \n"
                            + "försök igen senare eller kontakta administratören. "
                            + "(" + status + ")", "danger");
                    console.log(status);
                }
            });
        }
    };

    //Ta id_token som används i backend för att få google_id
    $scope.googleLogin = function (googleAnvändare) {
        $scope.id_token = googleAnvändare.getAuthResponse().id_token;
    };

    window.onSignIn = $scope.googleLogin;
});





