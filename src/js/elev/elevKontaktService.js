/* global SERVER_URL */

module.service("elevKontaktService", function ($q) {
    this.url = SERVER_URL + "/info/elev/kontakt";

    this.getKontakt = function (id_token) {
        var deferred = $q.defer();
        $.ajax({
            url: this.url,
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

