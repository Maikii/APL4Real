module.controller("larareOversiktCtrl", function ($scope, larareService, larareOversiktService, globalService) {
    $scope.larareService = larareService;
    $scope.labels = ["Bra", "Sådär", "Dåligt"];
    $scope.colours = ["#89ba17", "#f0de00", "#dc002e"];
    $scope.charts = [];
    $scope.chart_data = [];
    $scope.years = [];
    $scope.currentMonth = new Date().getMonth() + 1;
    $scope.currentYear = new Date().getFullYear();
    var id_token;
    if (globalService.isLoggedIn(true)) {
        var anvandare = JSON.parse(localStorage.anvandare);
        id_token = anvandare.id_token;

        larareService.getKlasser(id_token).then(function (data) {
            $scope.klasser = data;
            for (var i = 2016; i <= $scope.currentYear; i++)
                $scope.years.push(i);
            $scope.years.reverse();
            var klass = larareService.getSetting("lastKlass");
            if (klass)
                $scope.getOmdome(klass, $scope.currentYear, $scope.currentMonth);
        });
    }
    $scope.displayCharts = function () {
        $scope.charts = [];
        $.each($scope.chart_data, function (index, value) {
            var ctx = $('#' + value.id).get(0).getContext("2d");
            $scope.charts.push(new Chart(ctx,
                    {type: 'pie', data: value.data}
            ));
            $('#' + value.name_id).html("<strong>"+value.name+"</strong>");
        });
    };
    $scope.getOmdome = function (klass_id, year, month) {
        if (klass_id)
            larareService.setSetting('lastKlass', klass_id);
        console.log(klass_id + "  " + year + "  " + month)
        if (klass_id && year && month)
            larareOversiktService.getOmdome(id_token, klass_id, year, month).then(function (data) {
                $("#chartContainer").empty();
                $scope.chart_data = [];
                for (var i = 0; i < data.length; i++) {
                    $scope.chart_data.push({
                        id: "chart_" + i,
                        name_id: "chart_name_" + i,
                        name: data[i].namn,
                        data: {
                            labels: $scope.labels,
                            datasets: [{
                                    data: [data[i].antal2, data[i].antal1, data[i].antal0],
                                    backgroundColor: $scope.colours
                                }]
                        }
                    });
                    $("#chartContainer").append('<div><p id="chart_name_' + i + '"></p><canvas id="chart_' + i + '" class="chart chart-pie"></canvas></div>');
                }
                $scope.displayCharts();
            });
    };
});