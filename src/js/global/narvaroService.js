/* global SERVER_URL, IMG_SERVER_URL */

module.service("narvaroService", function ($q, $http) {
    //Siffror till klasser
    this.parseClass = function (ljus, godkant) {
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
    //Visa upp dagens datum annorlunda
    this.todayClass = function (datum) {
        if (datum.getFullYear() === new Date().getFullYear()
                && datum.getMonth() === new Date().getMonth()
                && datum.getDate() === new Date().getDate()) {
            return 'idag';
        }
    };
    //Hämta färg på dag med datum
    this.getLjus = function (datum, narvaro) {
        //Datum till index
        var index = arrayObjectIndexOf(narvaro, datum.getTime() / 1000, "datum");
        if (index !== -1) {
            return narvaro[index].trafikljus;
        } else {
            return -1;
        }
    };
    //Hämta godkänt med datum
    this.getGodkant = function (datum, narvaro) {
        //Datum till index
        var index = arrayObjectIndexOf(narvaro, datum.getTime() / 1000, "datum");
        if (index !== -1) {
            return narvaro[index].godkant;
        } else {
            return -1;
        }
    };
    this.getVeckor = function (year, month) {
        //Skapa array med datumen i månaden

        //Början av månaden
        var start = new Date(year, month, 1);
        //Slutet av månaden
        var stop = new Date(year, month, new Date(year, month + 1, 0).getDate());
        //Fyll i dagarna imellan
        var date_array = getDates(start, stop);

        //Fyll på med dagar så att arrayen börjar med måndag (1)
        while (date_array[0].getDay() !== 1) {
            //Kopiera första dagen
            var ny_dag = date_array[0];
            //Lägg till den i början
            date_array.unshift(ny_dag);
            //Minska datumet med 1
            date_array[0] = date_array[0].removeDays(1);
        }
        //Fyll på så att den slutar på dagen innan måndag (1)
        while (date_array[date_array.length - 1].getDay() !== 1) {
            //Kopiera sista dagen
            var ny_dag = date_array[date_array.length - 1];
            //Lägg till den i slutet
            date_array.push(ny_dag);
            //Öka datumet med 1
            date_array[date_array.length - 1] = date_array[date_array.length - 1].addDays(1);
        }
        //Skapa en objektarray av datumen
        var narvaro_array = [];
        for (var i = 0; i < date_array.length - 1; i++) {
            var dag = date_array[i];
            narvaro_array.push({
                datum: dag
            });
        }
        //Lägg in dagarna veckovis i scope
        var veckor = [];
        for (i = 0, j = narvaro_array.length; i < j; i += 7) {
            var temparray = narvaro_array.slice(i, i + 7);
            var vecka = {
                veckonummer: temparray[0].datum.getWeekNumber(),
                dagar: temparray
            };
            veckor.push(vecka);
        }
        return veckor;
    };
});