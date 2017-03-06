/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.controller("elevSeNarvaroCtrl", function ($scope, elevNarvaroGetService, globalService) {
    $scope.years = [];
    $scope.start = 0;
    $scope.currentMonth = new Date().getMonth();
    $scope.currentYear = new Date().getFullYear();
    if (globalService.isLoggedIn(true)) {
        var anvandare = JSON.parse(localStorage.anvandare);
        var id_token = anvandare.id_token;
        elevNarvaroGetService.getNarvaro(id_token).then(function (data) {
            $scope.elev_narvaro = data;
            $scope.getVeckor();
            for (var i = $scope.currentYear - 10; i <= $scope.currentYear; i++)
                $scope.years.push(i);
            $scope.years.reverse();
        });
    }
    $scope.parseClass = function (ljus, godkant) {
        if (godkant === 0)
            return 'gra';
        if (ljus === 0)
            return 'rod';
        else if (ljus === 1)
            return 'gul';
        else if (ljus === 2)
            return 'gron';
        else
            return 'vit';

    };
    $scope.todayClass = function (datum) {
        if (datum.getFullYear() === new Date().getFullYear()
                && datum.getMonth() === new Date().getMonth()
                && datum.getDate() === new Date().getDate()) {
            return 'idag';
        }
    };
    $scope.setStart = function (p) {
        $scope.start = p;
    };
    $scope.getLjus = function (datum) {
        var index = arrayObjectIndexOf($scope.elev_narvaro, datum.getTime() / 1000, "datum");
        if (index !== -1)
        {
            return $scope.elev_narvaro[index].trafikljus;
        } else {
            return -1;
        }
    };
    $scope.getGodkant = function (datum) {
        var index = arrayObjectIndexOf($scope.elev_narvaro, datum.getTime() / 1000, "datum");
        if (index !== -1)
        {
            return $scope.elev_narvaro[index].godkant;
        } else {
            return -1;
        }
    };
    $scope.getVeckor = function (year, month) {
        var narvaro = $scope.elev_narvaro;
        var sista_dag = new Date(narvaro[narvaro.length - 1].datum * 1000);
        if (!month) {
            month = sista_dag.getMonth();
            $scope.selected_month = "" + month;
        }
        if (!year) {
            year = sista_dag.getFullYear();
            $scope.selected_year = year;
        }
        //skapa array med datumen i månaden
        var start = new Date(year, month, 1);
        var stop = new Date(year, month, new Date(year, month + 1, 0).getDate());
        var date_array = getDates(start, stop);
        //Fyll på med tomma dagar så att arrayen börjar med måndag (1)
        while (date_array[0].getDay() !== 1) {
            var ny_dag = date_array[0];
            date_array.unshift(ny_dag);
            date_array[0] = date_array[0].removeDays(1);
        }
        //fyll på så att den slutar på dagen innan måndag (1)
        while (date_array[date_array.length - 1].getDay() !== 1) {
            var ny_dag = date_array[date_array.length - 1];
            date_array.push(ny_dag);
            date_array[date_array.length - 1] = date_array[date_array.length - 1].addDays(1);
        }
        var narvaro_array = [];
        //skapa en objektarray av datumen
        for (var i = 0; i < date_array.length - 1; i++) {
            var dag = date_array[i];
            narvaro_array.push({
                datum: dag
            });
        }
        //lägg in dagarna veckovis i scope
        $scope.veckor = [];
        for (i = 0, j = narvaro_array.length; i < j; i += 7) {
            var temparray = narvaro_array.slice(i, i + 7);
            var vecka = {
                veckonummer : temparray[0].datum.getWeekNumber(),
                dagar: temparray
            };
            $scope.veckor.push(vecka);
        }
    };
});
function arrayObjectIndexOf(myArray, searchTerm, property) {
    for (var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property] === searchTerm)
            return i;
    }
    return -1;
}

Date.prototype.addDays = function (days) {
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
};
Date.prototype.removeDays = function (days) {
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() - days);
    return dat;
};
Date.prototype.getWeekNumber = function(){
    var d = new Date(+this);
    d.setHours(0,0,0,0);
    d.setDate(d.getDate()+4-(d.getDay()||7));
    return Math.ceil((((d-new Date(d.getFullYear(),0,1))/8.64e7)+1)/7);
};
function getDates(startDate, stopDate) {
    var dateArray = new Array();
    var currentDate = startDate;
    while (currentDate <= stopDate) {
        dateArray.push(currentDate);
        currentDate = currentDate.addDays(1);
    }
    return dateArray;
}