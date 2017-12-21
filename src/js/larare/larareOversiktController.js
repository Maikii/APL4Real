module.controller("larareOversiktCtrl", function ($scope, larareService, larareOversiktService, globalService) {
    //Lägg till i scope för användning i template
    $scope.larareService = larareService;
    //Variabler
    $scope.labels = ["Bra", "Sådär", "Dåligt"];
    $scope.colours = ["#89ba17", "#f0de00", "#dc002e"];
    $scope.charts = [];
    $scope.chart_data = [];
    $scope.years = [];
    $scope.currentMonth = new Date().getMonth() + 1;
    $scope.currentYear = new Date().getFullYear();
    var id_token;

    //Hämta elever om inloggad
    if (globalService.isLoggedIn(true)) {
        var anvandare = JSON.parse(localStorage.anvandare);
        id_token = anvandare.id_token;

        larareService.getKlasser(id_token).then(function (data) {
            $scope.klasser = data;
            for (var i = 2016; i <= $scope.currentYear; i++)
                $scope.years.push(i);
            $scope.years.reverse();
            //Välj den sista valda klassen automatiskt
            var klass = larareService.getSetting("lastKlass");
            //Hämta omdöme om klassen är vald
            if (klass)
                $scope.getOmdome(klass, $scope.currentYear, $scope.currentMonth);
        });
    }
    //Hämtar omdömen från en klass i vald månad
    $scope.getOmdome = function (klass_id, year, month) {
        //Spara vald klass
        if (klass_id)
            larareService.setSetting('lastKlass', klass_id);

        if (klass_id && year && month) {
            larareOversiktService.getOmdome(id_token, klass_id, year, month).then(function (data) {
                //Töm gammal data
                $("#chartContainer").empty();
                $scope.chart_data = [];
                //Fyll i ny data
                for (var i = 0; i < data.length; i++) {
                    var id = "chart_" + i;
                    var name_id = "chart_name_" + i;
                    $scope.chart_data.push({
                        id: id,
                        name_id: name_id,
                        name: data[i].namn,
                        data: {
                            labels: $scope.labels,
                            datasets: [{
                                    data: [data[i].antal2, data[i].antal1, data[i].antal0],
                                    backgroundColor: $scope.colours
                                }]
                        }
                    });
                    //Lägg till element i html
                    $("#chartContainer").append('<div><p id="' + name_id + '"></p><canvas id="' + id + '" class="chart chart-pie"></canvas></div>');
                }
                //Visa omdöme
                $scope.displayCharts();
            });
        }
    };
    //Visar omdömen
    $scope.displayCharts = function () {
        //Allt i $scope.charts visas automatiskt via angular
        $scope.charts = [];
        $.each($scope.chart_data, function (index, value) {
            var ctx = $('#' + value.id).get(0).getContext("2d");
            //Skapa & visa en ny chart
            $scope.charts.push(new Chart(
                    ctx, {
                        type: 'pie',
                        data: value.data
                    }
            ));
            $('#' + value.name_id).html("<strong>" + value.name + "</strong>");
        });
    };
});