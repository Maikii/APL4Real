/* global SERVER_URL */

module.service("getServiceLoggar", function ($http, $q) {
    this.url = SERVER_URL + "/elev";

    this.getLoggar = function (id_token) {
        var deferred = $q.defer();
        $.ajax({
            url: this.url + "/logg",
            type: 'GET',
            headers: {
                "Authorization": id_token,
                "Content-Type": 'application/json'
            },
            dataType: 'json',
            success: function (data) {
                deferred.resolve(data);
            },
            error: function (data) {
                deferred.resolve(data);
            }
        });
        return deferred.promise;
    };
});
