/* global SERVER_URL */

module.service("registrationService", function ($http, $q) {
    //Använder inte skickaData för den kräver att man är inloggad
    this.postRegistration = function (google_id, namn, klass, tfnr) {
        var deferred = $q.defer();
        var url = SERVER_URL + "/apl/google/registrera";
        var data = {
            id: google_id,
            namn: namn,
            tfnr: tfnr,
            klass: parseInt(klass)
        };
        $http.post(url, data).then(
                function successCallback(response) {
                    deferred.resolve(response.status);
                },
                function errorCallback(response) {
                    deferred.resolve(response.status);
                }
        );
        return deferred.promise;
    };

    this.getKlasser = function () {
        var deferred = $q.defer();
        var url = SERVER_URL + "/apl/klass";
        $http({method: "GET", url: url}).success(function (data, status) {
            console.log(data);
            deferred.resolve(data);
        }).error(function (data, status) {
            console.log("Error");
            console.log(status);
            deferred.reject();
        });
        return deferred.promise;
    };
});
