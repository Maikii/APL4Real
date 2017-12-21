/* global SERVER_URL */

module.service("larareNatverkService", function ($http, $q) {
    this.getNatverk = function (id_token) {
        var deferred = $q.defer();
        var url = SERVER_URL + "/larare/handledare/natverk";
        $http({
            method: "GET",
            url: url,
            headers: {
                'Authorization': id_token
            }
        }).success(function (data) {
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