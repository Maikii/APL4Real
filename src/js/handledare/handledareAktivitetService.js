/* global SERVER_URL */

module.service("handledareAktivitetService", function ($q) {
    this.url = SERVER_URL + "/handledare";
    this.getHandledareAktiviteter = function (basic_auth) {
        var deferred = $q.defer();
        $.ajax({
            url: this.url + "/aktiviteter",
            type: 'GET',
            headers: {
                "Authorization": basic_auth
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
