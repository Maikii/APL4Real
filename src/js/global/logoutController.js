/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


module.controller("logoutCtrl", function ($window) {
    localStorage.anvandare = "";
    window.onSignOut = function () {
        var auth2 = gapi.auth2.getAuthInstance();
        console.log(auth2);
        auth2.signOut().then(function () {
            $window.location.href = "#/";
        });
    };
});