/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.controller("lärareSeLoggCtrl", function ($scope, $window, getService, postService){
        var anvandare = JSON.parse(localStorage.anvandare);
    var id_token = anvandare.id_token;
    var promiseLoggar = getService.getLoggar(id_token);
    promiseLoggar.then(function (data){
        console.log(data);
        $scope.loggar = data;
    });
});
