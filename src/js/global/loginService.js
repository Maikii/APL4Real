/* global SERVER_URL */

module.service("loginService", function ($q) {
    this.url = SERVER_URL + "/apl";
    this.logInGoogle = function (id_token) {
        var deferred = $q.defer();

        $.ajax({
            url: this.url + "/google/login",
            type: 'get',
            headers: {
                "Content-Type": 'application/json',
                "Authorization": id_token
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
    this.logInHandledare = function (anvandarnamn, losenord) {
        var deferred = $q.defer();
        //Enkel kryptering
        var basic_auth = "Basic " + btoa(anvandarnamn + ":" + losenord);

        $.ajax({
            url: this.url + "/handledare/login",
            type: 'get',
            headers: {
                "Content-Type": 'application/json',
                "Authorization": basic_auth
            },
            success: function (data) {
                deferred.resolve(200);
            },
            error: function (data) {
                deferred.resolve(data.status);
            }
        });
        return deferred.promise;
    };
});
