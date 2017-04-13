/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

module.service("larareOversiktService", function ($q) {
    this.getOmdome = function (id_token, klass_id, year, month) {
        var deferred = $q.defer();
        var url = SERVER_URL + "/larare/klass/" + klass_id + "/omdome/" + year + "/" + month;
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
            error: function (data)
            {
                deferred.resolve(data);
            }
        });
        return deferred.promise;
    };
});
