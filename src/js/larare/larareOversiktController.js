module.controller("larareOversiktCtrl", function ($scope, larareService, larareOversiktService, globalService) {
    $scope.larareService = larareService;
    $scope.labels = ["Bra", "Sådär", "Dåligt"];
    $scope.colours = ["#89ba17", "#f0de00", "#dc002e"];
    $scope.charts = [];
    $scope.chart_data = [];
    var id_token;
    if (globalService.isLoggedIn(true)) {
        var anvandare = JSON.parse(localStorage.anvandare);
        id_token = anvandare.id_token;

        larareService.getKlasser(id_token).then(function (data) {
            $scope.klasser = data;
        });
    }
    $scope.displayCharts = function () {
        $scope.charts = [];
        $.each($scope.chart_data, function (index, value) {
            var ctx = $('#' + value.id).get(0).getContext("2d");
            $scope.charts.push(new Chart(ctx).Pie(value.data));
            $('#' + value.name_id).text(value.name);
        });
    };
    $scope.getOmdome = function (klass_id) {
        larareService.setSetting('lastKlass', klass_id);
        larareOversiktService.getOmdome(id_token, klass_id).then(function (data) {
            $("#chartContainer").empty();
            $scope.chart_data = [];
            for (var i = 0; i < data.length; i++) {
                $scope.chart_data.push({
                    id: "chart_" + i,
                    name_id: "chart_name_" + i,
                    name: data[i].namn,
                    data: [{
                            value: data[i].antal2,
                            color: $scope.colours[0],
                            label: $scope.labels[0]

                        }, {
                            value: data[i].antal1,
                            color: $scope.colours[1],
                            label: $scope.labels[1]

                        }, {
                            value: data[i].antal0,
                            color: $scope.colours[2],
                            label: $scope.labels[2]
                        }]
                });
                $("#chartContainer").append('<div><p id="chart_name_' + i + '"></p><canvas id="chart_' + i + '" class="chart chart-pie"></canvas></div>');
            }
            $scope.displayCharts();
        });
    };
});