/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

module.controller("handledareRegCtrl", function ($scope, registrationService) {
    $scope.registreraHandledare = function(){
        console.log("handreg");
        var användarnamn = $scope.username;
        var lösenord = $scope.password;
        var email = $scope.email;
        var tfnr = $scope.phone;
        var namn = $scope.name;
        var promise = registrationService.registreraHandledare(användarnamn, namn, lösenord, email, tfnr);
        promise.then(function (status) {
            if (status === 200) {
                console.log("logged in");
                alert("Du är inloggad!");
            } else {
                console.log("error: Status "+status);
            }
        });
    };
});