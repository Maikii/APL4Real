/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.controller("larareSeNarvaroCtrl", function ($scope, larareSeNarvaroService, larareService, globalService) {
    $scope.larareService = larareService;
    $scope.years = [];
    $scope.start = 0;
    $scope.currentMonth = new Date().getMonth();
    $scope.currentYear = new Date().getFullYear();
    if (globalService.isLoggedIn(true)) {
        var anvandare = JSON.parse(localStorage.anvandare);
        var id_token = anvandare.id_token;
        larareService.getKlasser(id_token).then(function (data) {
            $scope.klasser = data;
        });
    }
    $scope.getElever = function (klass_id) {
        larareService.setSetting('lastKlass', klass_id);
        larareSeNarvaroService.getGodkandNarvaro(id_token, klass_id).then(function (data) {
            for (var i = 0; i < data.length; i++) {
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
                            data[i].total.gron = data[i].total.gron+1;
                    } else {
                        data[i].total.gra++;
                    }
                }
            }
            var alla = [];
            alla.push({elev_id: -1, namn: "Alla"});
            $scope.elever = alla.concat(data);
            $scope.getVeckor();
            for (var i = $scope.currentYear - 10; i <= $scope.currentYear; i++)
                $scope.years.push(i);
            $scope.years.reverse();
        });
    };
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
    $scope.getElev = function (elev_id) {
        return $scope.elever[arrayObjectIndexOf($scope.elever, elev_id, "elev_id")];
    };
    $scope.getGrammar = function (value, onNone, onOne, onMany) {
        return value > 0 ? value > 1 ? onMany : onOne : onNone;
    };
    $scope.getLjus = function (elev, datum) {
        var index = arrayObjectIndexOf(elev.narvaro, datum.getTime() / 1000, "datum");
        if (index !== -1)
        {
            return elev.narvaro[index].trafikljus;
        } else {
            return -1;
        }
    };
    $scope.getGodkant = function (elev, datum) {
        var index = arrayObjectIndexOf(elev.narvaro, datum.getTime() / 1000, "datum");
        if (index !== -1)
        {
            return elev.narvaro[index].godkant;
        } else {
            return -1;
        }
    };
    $scope.getTotalGodkant = function (elev) {
        var total = {

        }
        for (var i = 0; i < elev.narvaro.length; i++) {

        }
        var index = arrayObjectIndexOf(elev.narvaro, datum.getTime() / 1000, "datum");
        if (index !== -1)
        {
            return elev.narvaro[index].godkant;
        } else {
            return -1;
        }
    };
    $scope.getVeckor = function (year, month) {
        if (!year) {
            year = $scope.currentYear;
        }
        if (!month) {
            month = $scope.currentMonth;
        }
        //skapa array med datumen i månaden
        var start = new Date(year, month, 1);
        var stop = new Date(year, month, new Date(year, month + 1, 0).getDate());
        var date_array = getDates(start, stop);
        //Fyll på med tomma dagar så att arrayen börjar med måndag
        while (date_array[0].getDay() !== 1) {
            var ny_dag = date_array[0];
            date_array.unshift(ny_dag);
            date_array[0] = date_array[0].removeDays(1);
        }
        //fyll på så att den slutar på söndag
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
                veckonummer: temparray[0].datum.getWeekNumber(),
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
Date.prototype.getWeekNumber = function () {
    var d = new Date(+this);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    return Math.ceil((((d - new Date(d.getFullYear(), 0, 1)) / 8.64e7) + 1) / 7);
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