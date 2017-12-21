/* global SERVER_URL */

module.service("larareMomentService", function ($http, $q) {
    //Hämta moment
    this.getMoment = function (id_token, elev_id) {
        var deferred = $q.defer();
        var url = SERVER_URL + "/larare/elev/" + elev_id + "/moment";
        $.ajax({
            url: url,
            type: 'GET',
            headers: {
                "Authorization": id_token,
                "Content-Type": "application/json"
            },
            success: function (data) {
                deferred.resolve(data);
            },
            error: function (data)
            {
                deferred.resolve(data);
            }
        });

        return deferred.promise;
    };

    //hämta moment
    this.getMomentLärare = function (id_token) {
        var deferred = $q.defer();
        var url = SERVER_URL + "/larare/moment";
        $.ajax({
            url: url,
            type: 'GET',
            headers: {
                "Authorization": id_token,
                "Content-Type": "application/json"
            },
            success: function (data) {
                deferred.resolve(data);
            },
            error: function (data)
            {
                deferred.resolve(data);
            }
        });

        return deferred.promise;
    };

    //Radera Moment
    this.larareRaderaMoment = function (id_token, moment_id) {
        var deferred = $q.defer();
        var url = SERVER_URL + "/larare/moment/" + moment_id;
        $.ajax({
            url: url,
            type: 'DELETE',
            headers: {
                "Authorization": id_token,
                "Content-Type": "application/json"
            },
            success: function (data) {
                deferred.resolve(data);
            },
            error: function (data, status, headers, config) {
                deferred.resolve(status);
            }

        });
        return deferred.promise;
    };
    //Radera Moment
    this.elevRaderaMoment = function (id_token, moment_id, elev_id) {
        var deferred = $q.defer();
        var url = SERVER_URL + "/larare/elev/" + elev_id + "/moment/" + moment_id;
        $.ajax({
            url: url,
            type: 'DELETE',
            headers: {
                "Authorization": id_token,
                "Content-Type": "application/json"
            },
            success: function (data) {
                deferred.resolve(data);
            },
            error: function (data, status, headers, config) {
                deferred.resolve(status);
            }
        });
        return deferred.promise;
    };
});
