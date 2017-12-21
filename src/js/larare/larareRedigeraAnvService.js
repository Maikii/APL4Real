/* global SERVER_URL */

module.service("larareRedigeraAnvService", function ($q) {
    this.getElevInfo = function (id_token, elev_id) {
        var deferred = $q.defer();
        var url = SERVER_URL + "/info/elev/" + elev_id;
        $.ajax({
            url: url,
            type: 'GET',
            headers: {
                "Authorization": id_token,
                "Content-Type": 'application/json'
            },
            success: function (data) {
                deferred.resolve(data);
            },
            error: function (data) {
                deferred.resolve(data);
            }
        });
        return deferred.promise;
    };

    this.getHLInfo = function (id_token, hl_id) {
        var deferred = $q.defer();
        var url = SERVER_URL + "/info/handledare/" + hl_id;
        $.ajax({
            url: url,
            type: 'GET',
            headers: {
                "Authorization": id_token,
                "Content-Type": 'application/json'
            },
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
