module.controller("larareSeNarvaroCtrl", function ($scope, larareSeNarvaroService, larareService, narvaroService, globalService) {
    //Lägg till i scope för användning i template
    $scope.larareService = larareService;
    //Initiera variablerna
    $scope.years = [];
    $scope.start = 0;
    $scope.currentMonth = new Date().getMonth();
    $scope.currentYear = new Date().getFullYear();
    //Hämta klasser om inloggad
    if (globalService.isLoggedIn(true)) {
        var anvandare = JSON.parse(localStorage.anvandare);
        var id_token = anvandare.id_token;
        larareService.getKlasser(id_token).then(function (data) {
            $scope.klasser = data;
        });
    }
    //Hämta elever & initiera närvaro
    $scope.getElever = function (klass_id) {
        //Spara vald klass
        larareService.setSetting('lastKlass', klass_id);
        larareSeNarvaroService.getGodkandNarvaro(id_token, klass_id).then(function (data) {
            for (var i = 0; i < data.length; i++) {
                //Räkna summor
                data[i].total = {
                    sum: data[i].narvaro.length,
                    gra: 0,
                    rod: 0,
                    gul: 0,
                    gron: 0
                };
                for (var j = 0; j < data[i].narvaro.length; j++) {
                    if (data[i].narvaro[j].godkant) {
                        if (data[i].narvaro[j].trafikljus === 0)
                            data[i].total.rod++;
                        else if (data[i].narvaro[j].trafikljus === 1)
                            data[i].total.gul++;
                        else if (data[i].narvaro[j].trafikljus === 2)
                            data[i].total.gron = data[i].total.gron + 1;
                    } else {
                        data[i].total.gra++;
                    }
                }
            }
            var alla = [];
            alla.push({elev_id: -1, namn: "Alla"});
            $scope.elever = alla.concat(data);
            //Initiera kalendern
            $scope.getVeckor();
            //Val av år, 2016 och senare
            for (var i = 2016; i <= $scope.currentYear; i++)
                $scope.years.push(i);
            $scope.years.reverse();
        });
    };
    //Visa vald elevs närvaro
    $scope.getElev = function (elev_id) {
        return $scope.elever[arrayObjectIndexOf($scope.elever, elev_id, "elev_id")];
    };
    //Grammatik, viktiga saker det här
    $scope.getGrammar = function (value, onNone, onOne, onMany) {
        return value > 0 ? value > 1 ? onMany : onOne : onNone;
    };
    //Siffror till klasser
    $scope.parseClass = function (ljus, godkant) {
        return narvaroService.parseClass(ljus, godkant);
    };
    //Visa upp dagens datum annorlunda
    $scope.todayClass = function (datum) {
        return narvaroService.todayClass(datum);
    };
    //Hämta färg på dag med datum
    $scope.getLjus = function (elev, datum) {
        return narvaroService.getLjus(datum, elev.narvaro);
    };
    //Hämta godkänt med datum
    $scope.getGodkant = function (elev, datum) {
        return narvaroService.getGodkant(datum, elev.narvaro);
    };
    //Bygg struktur för veckor i kalendern
    $scope.getVeckor = function (year, month) {
        if (!year) {
            year = $scope.currentYear;
        }
        if (!month) {
            month = $scope.currentMonth;
        }
        $scope.veckor = narvaroService.getVeckor(year, month);
    };
});