/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



/* global SERVER_URL */

module.service("handledareService", function ($q) {
    this.text = {
        se: {
            //Aktivitet
            yes: "Ja",
            no: "Nej",
            confirm: "Stämmer detta",
            momentTitle: "Moment",
            moment: "tycker att de har avklarat följande moment",
            loggbokTitle: "Loggbok",
            loggbok: "har skickat in följande loggbok",
            narvaroTitle: "Närvaro",
            narvaro1: "rapporterade att hen var",
            narvaro2a: "frånvarande",
            narvaro2b: "delvis närvarande",
            narvaro2c: "närvarande hela",
            narvaro3: "denna dag",
            //Menu
            aktivitet: "Aktivitet",
            seeMoment: "Se moment",
            kontakt: "Kontakt",
            loggaut: "Logga ut",
            //Kontakt
            namn: "Namn",
            mail: "Mail",
            telefonnummer: "Telefonnummer",
            tfnr: "Tfnr.",
            //Moment
            moments: "Moment",
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
            momentTitle: "Assignment",
            moment: "believes they have completed the following assignment",
            loggbokTitle: "Logbook",
            loggbok: "has sent in the following logbook",
            narvaroTitle: "Attendance",
            narvaro1: "reported being",
            narvaro2a: "absent",
            narvaro2b: "partly present",
            narvaro2c: "present the entirety of",
            narvaro3: "this day",
            //Menu
            aktivitet: "Activity",
            seeMoment: "View assignments",
            kontakt: "Contact",
            loggaut: "Log out",
            //Kontakt
            namn: "Name",
            mail: "Mail",
            telefonnummer: "Phone Number",
            tfnr: "Phone",
            //Moment
            moments: "Assignments",
            elevchoice: "Choose student",
            status: "Status",
            innehall: "Content",
            status0: "Unfinished",
            status1: "Awaiting Confirmation",
            status2: "Completed",
            status3: "Declined"
        }
    };
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
    this.getText = function (text) {
        var language = JSON.parse(localStorage.settings).language;
        return this.text[language][text];
    };
    this.getFlagUrl = function () {
        var language = JSON.parse(localStorage.settings).language;
        return this.flags[language];
    };
});
