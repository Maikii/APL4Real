

module.controller("lärareCtrl",function($scope, $http){
    $http.get("http://10.97.72.5:8080/aplBackend/webresources/elev").success(function(data){
        $scope.elever = data;

    });
    $http.get("http://10.97.72.5:8080/aplBackend/webresources/handledare").success(function (data) {
        $scope.handledare = data;
    });

    $http.get("http://10.97.72.5:8080/aplBackend/webresources/handledare/program").success(function (data) {
        $scope.program = data;
    });
});
