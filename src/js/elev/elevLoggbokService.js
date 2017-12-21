/* global SERVER_URL */

module.service("elevLoggbokService", function ($q, globalService) {
    this.postLogg = function (datum, innehall, ljus, imgUrl) {
        var targetUrl = "/elev/logg";
        var data = {
            "datum": datum,
            "innehall": innehall,
            "ljus": ljus,
            "imgUrl": imgUrl
        };
        return globalService.skickaData(targetUrl, data);
    };
});
