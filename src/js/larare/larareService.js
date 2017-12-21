/* global SERVER_URL */

module.service("larareService", function ($q) {
    this.getKlasser = function (id_token) {
        var deferred = $q.defer();
        $.ajax({
            url: SERVER_URL + "/larare/klasser",
            type: 'GET',
            headers: {
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

    this.getAllaKlasser = function () {
        var url = SERVER_URL + "/apl/klass";
        var deferred = $q.defer();
        $.ajax({
            url: url,
            type: 'get',
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

    this.getProgram = function () {
        var deferred = $q.defer();
        var url = SERVER_URL + "/apl/program/";
        $.ajax({
            url: url,
            type: 'GET',
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

    this.getAnvandarensElever = function (id_token) {
        var deferred = $q.defer();
        $.ajax({
            url: SERVER_URL + "/larare/elever",
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

    this.getElever = function (id_token, klass_id) {
        var deferred = $q.defer();
        $.ajax({
            url: SERVER_URL + "/larare/klass/" + klass_id,
            type: 'GET',
            headers: {
                "Authorization": id_token,
                "Content-Type": 'application/json'
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

    this.getHL = function (id_token) {
        var url = SERVER_URL + "/info/handledare/lista/alla";
        var deferred = $q.defer();
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

    this.getHLPP = function (id_token, program) {
        var url = SERVER_URL + "/info/handledare/program/" + program;
        var deferred = $q.defer();
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

    //Spara inställningar
    this.larareSettings;
    if (!this.larareSettings) {
        if (!localStorage.larareSettings) {
            //Senaste valda saker
            this.larareSettings = {
                lastKlass: -1,
                lastElev: -1,
                lastProgram: -1
            };
            localStorage.larareSettings = JSON.stringify(this.larareSettings);
        } else {
            this.larareSettings = JSON.parse(localStorage.larareSettings);
        }
    }
    this.getSetting = function (setting) {
        return this.larareSettings[setting];
    };
    this.setSetting = function (setting, value) {
        this.larareSettings[setting] = value;
        localStorage.larareSettings = JSON.stringify(this.larareSettings);
    };
});
