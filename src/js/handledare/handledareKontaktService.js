/* global SERVER_URL */

module.service("handledareKontaktService", function ($q) {
    this.url = SERVER_URL + "/info/handledare/kontakt";

    this.getKontakt = function (basic_auth) {
        var deferred = $q.defer();
        $.ajax({
            url: this.url,
            type: 'GET',
            headers: {
                "Authorization": basic_auth,
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

