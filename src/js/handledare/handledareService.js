/* global SERVER_URL */

module.service("handledareService", function ($q) {
    //Text för alla språk
    this.text = {
        se: {
            //Aktivitet
            yes: "Ja",
            no: "Nej",
            confirm: "Stämmer detta",
            //Menu
            aktivitet: "Aktivitet",
            seeMoment: "Se moment",
            kontakt: "Kontakt",
            loggaut: "Logga ut",
            //Kontakt
            typ: "Typ",
            namn: "Namn",
            mail: "Mail",
            telefonnummer: "Telefonnummer",
            tfnr: "Tfnr.",
            larare: "Lärare",
            elev: "Elev",
            //Loggbok
            loggbokTitle: "Loggbok",
            loggbok: "har skickat in följande loggbok",
            //Närvaro
            narvaroTitle: "Närvaro",
            narvaro1: "rapporterade att hen var",
            narvaro2a: "frånvarande",
            narvaro2b: "delvis närvarande",
            narvaro2c: "närvarande hela",
            narvaro3: "denna dag",
            //Moment
            momentTitle: "Moment",
            moment: "tycker att de har avklarat följande moment",
            moments: "Moment",
            //Responses
            confirmSuccess: "Aktiviteten godkändes.",
            declineSuccess: "Aktiviteten nekades.",
            defaultFailure: "Aktiviteten kommer skickas automatiskt.",
            //Annat
            elevchoice: "Välj elev",
            status: "Status",
            innehall: "Innehåll",
            status0: "Ej avklarad",
            status1: "Väntande svar",
            status2: "Godkänd",
            status3: "Nekad"
        },
        en: {
            //Aktivitet
            yes: "Yes",
            no: "No",
            confirm: "Is this correct",
            //Menu
            aktivitet: "Activity",
            seeMoment: "View assignments",
            kontakt: "Contact",
            loggaut: "Log out",
            //Kontakt
            typ: "Type",
            namn: "Name",
            mail: "Mail",
            telefonnummer: "Phone Number",
            tfnr: "Phone",
            larare: "Teacher",
            elev: "Student",
            //Loggbok
            loggbokTitle: "Logbook",
            loggbok: "has sent in the following log",
            //Närvaro
            narvaroTitle: "Attendance",
            narvaro1: "reported being",
            narvaro2a: "absent",
            narvaro2b: "partly present",
            narvaro2c: "present the entirety of",
            narvaro3: "this day",
            //Moment
            momentTitle: "Assignment",
            moment: "believes they have completed the following assignment",
            moments: "Assignments",
            //Responses
            confirmSuccess: "Activity confirmed.",
            declineSuccess: "Activity declined.",
            defaultFailure: "The activity will be sent automatically.",
            //Annat
            elevchoice: "Choose student",
            status: "Status",
            innehall: "Content",
            status0: "Unfinished",
            status1: "Awaiting Confirmation",
            status2: "Completed",
            status3: "Declined"
        }
    };
    //Flaggor för språk
    this.flags = {
        se: "BilderAPL/Sweden-icon.png",
        en: "BilderAPL/United-Kingdom-icon.png"
    };
    this.getElever = function (basic_auth) {
        var deferred = $q.defer();
        var url = SERVER_URL + "/handledare/elever";
        $.ajax({
            url: url,
            type: 'GET',
            headers: {
                "Authorization": basic_auth,
                "Content-Type": "application/json"
            },
            success: function (data) {
                deferred.resolve(data);
            },
            error: function (data) {
                deferred.resolve(data);
            }
        });
        return deferred.promise;
    };
    //Tar text för valt språk
    this.getText = function (text) {
        var language = JSON.parse(localStorage.settings).language;
        return this.text[language][text];
    };
    this.getFlagUrl = function () {
        var language = JSON.parse(localStorage.settings).language;
        return this.flags[language];
    };
});
