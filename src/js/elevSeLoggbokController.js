/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

module.controller("elevSeLoggCtrl", function ($scope, getServiceLoggar) {
    var anvandare = JSON.parse(localStorage.anvandare);
    var id_token = anvandare.id_token;
    var promiseLoggar = getServiceLoggar.getLoggar(id_token);
    promiseLoggar.then(function (data){
        $scope.loggar = data;
    });
});
