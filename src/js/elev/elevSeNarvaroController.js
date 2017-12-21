module.controller("elevSeNarvaroCtrl", function ($scope, elevNarvaroGetService, narvaroService, globalService) {
    //Initiera variablerna
    $scope.years = [];
    $scope.start = 0;
    $scope.currentMonth = new Date().getMonth();
    $scope.currentYear = new Date().getFullYear();
    //Hämta & initiera närvaro
    if (globalService.isLoggedIn(true)) {
        var anvandare = JSON.parse(localStorage.anvandare);
        var id_token = anvandare.id_token;
        elevNarvaroGetService.getNarvaro(id_token).then(function (data) {
            $scope.elev_narvaro = data;
            //Initiera kalendern
            $scope.getVeckor();
            //Val av år, 2016 och senare
            for (var i = 2016; i <= $scope.currentYear; i++)
                $scope.years.push(i);
            $scope.years.reverse();
        });
    }
    //Siffror till klasser
    $scope.parseClass = function (ljus, godkant) {
        return narvaroService.parseClass(ljus, godkant);
    };
    //Visa upp dagens datum annorlunda
    $scope.todayClass = function (datum) {
        return narvaroService.todayClass(datum);
    };
    //Hämta färg på dag med datum
    $scope.getLjus = function (datum) {
        return narvaroService.getLjus(datum, $scope.elev_narvaro);
    };
    //Hämta godkänt med datum
    $scope.getGodkant = function (datum) {
        return narvaroService.getGodkant(datum, $scope.elev_narvaro);
    };
    //Bygg struktur för veckor i kalendern
    $scope.getVeckor = function (year, month) {
        var narvaro = $scope.elev_narvaro;
        //Hämta senaste närvaron
        var sista_dag = new Date(narvaro[narvaro.length - 1].datum * 1000);
        //Om månaden inte är vald, visa månaden för den senaste dagen
        if (!month) {
            month = sista_dag.getMonth();
            $scope.selected_month = "" + month;
        }
        //Om året inte är valt, visa året för den senaste dagen
        if (!year) {
            year = sista_dag.getFullYear();
            $scope.selected_year = year;
        }
        $scope.veckor = narvaroService.getVeckor(year, month);
    };
});