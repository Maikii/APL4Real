/* global SERVER_URL, IMG_SERVER_URL */

module.service("globalService", function ($q, $http) {
    //Visa notifikationer
    this.notify = function (message, type) {
        //Type: danger, info, success
        var element = '<div class="alert alert-' + type + '">';
        element += '<a class="close" data-dismiss="alert" aria-label="close">&times;</a>';
        element += message + '</div>';
        //Göm, lägg till på sidan, visa, göm efter 5 sekunder, ta bort
        $(element).hide().appendTo("#alerts").slideDown("fast").delay(5000).slideUp('slow', function () {
            $(this).remove();
        });
    };
    //Bygger bildurl
    this.getBildUrl = function (bild, storlek) {
        bild = bild.replace(/\"/g, "");
        //Hämtar bild i specifik storlek
        if (storlek)
            return IMG_SERVER_URL + "?file=" + bild + "&size=" + storlek;
        else
            return IMG_SERVER_URL + "?file=" + bild;
    };
    //Kollar om användaren är inloggad
    this.isLoggedIn = function (isGoogleUser, suppressNotifications) {
        if (localStorage.anvandare) {
            var anvandare = JSON.parse(localStorage.anvandare);
            if (isGoogleUser == undefined)
                isGoogleUser = anvandare.behorighet < 2;
            //Kollar om id_token finns / basic_auth om handledare
            if ((isGoogleUser && anvandare.behorighet < 2 && anvandare.id_token) ||
                    (!isGoogleUser && anvandare.behorighet == 2 && anvandare.basic_auth)) {
                return true;
            }
        }
        //Visar meddelande
        if (!suppressNotifications)
            this.notify("Du verkar inte vara inloggad längre, logga ut och in igen.", "danger");
        return false;
    };
    this.logout = function () {
        //Inloggad? (som google, visa ej meddelande)
        if (this.isLoggedIn(true, true)) {
            var anvandare = JSON.parse(localStorage.anvandare);
            delete anvandare.id_token;
            delete anvandare.google_id;
            delete anvandare.expires_at;
            localStorage.anvandare = JSON.stringify(anvandare);
            //Google logout
            return "#/logout";
        }
        //Inloggad? (som handledare, visa ej meddelande)
        else if (this.isLoggedIn(false, true)) {
            var anvandare = JSON.parse(localStorage.anvandare);
            delete anvandare.basic_auth;
            localStorage.anvandare = JSON.stringify(anvandare);
            //Handledare login sida
            return "/handledare";
        } else {
            //Startsida
            return "#";
        }
    };
    //Förbered att skicka till backend
    this.skickaData = function (url, data) {
        if (this.isLoggedIn()) {
            var google_id = JSON.parse(localStorage.anvandare).google_id;
            var anvandarnamn = JSON.parse(localStorage.anvandare).anvandarnamn;
            var objekt = {
                url: url,
                google_id: google_id,
                anvandarnamn: anvandarnamn,
                data: data
            };
            //Lägg till i oskickat
            var array = [];
            if (!localStorage.oskickat) {
                localStorage.oskickat = JSON.stringify([]);
            }
            array = JSON.parse(localStorage.oskickat);
            array.push(objekt);
            localStorage.oskickat = JSON.stringify(array);
            //Skickat allt i oskickat
            return this.kollaStorage();
        }
    };
    //Skicka data till backend
    this.kollaStorage = function () {
        var deferred = $q.defer();
        if (!localStorage.oskickat) {
            localStorage.oskickat = JSON.stringify([]);
        }
        //Om oskickat är längre än "[]"
        if (localStorage.oskickat.length > 2) {
            //Variabler
            var dataArray = JSON.parse(localStorage.oskickat);
            var anvandare = JSON.parse(localStorage.anvandare);
            var failed = [];
            var responses = [];
            //Handledare / google
            var auth;
            if (anvandare.behorighet === 2) {
                auth = anvandare.basic_auth;
            } else {
                auth = anvandare.id_token;
            }

            //Skicka
            function postData() {
                console.log("Posting data");
                var data = dataArray.pop();
                //Skickat inte om användaren inte matchar avsändaren
                if (data.google_id !== anvandare.google_id
                        || data.anvandarnamn !== anvandare.anvandarnamn) {
                    //Lägg tillbaka i oskickat
                    failed.push(data);
                    localStorage.oskickat = JSON.stringify(failed);
                    //Kolla nästa om det finns mer
                    if (dataArray.length > 0) {
                        postData();
                        return;
                    } else {
                        return;
                    }
                }
                localStorage.oskickat = JSON.stringify(failed);
                $http({
                    method: "POST",
                    url: SERVER_URL + data.url,
                    data: JSON.stringify(data.data),
                    headers: {'Authorization': auth}
                }).success(function (rdata, status, headers, config) {
                    response = {
                        data: rdata,
                        status: status,
                        headers: headers,
                        config: config
                    };
                    responses.push(response);
                    console.log("1.0.0");
                    //Kolla om det finns mer att skicka
                    if (dataArray.length === 0) {
                        //Skicka tillbaka responses för hantering
                        console.log("1.0.1");
                        deferred.resolve(responses);
                    } else {
                        //Skicka nästa
                        console.log("1.0.2");
                        postData();
                    }
                }).error(function (rdata, status, headers, config) {
                    response = {
                        data: rdata,
                        status: status,
                        headers: headers,
                        config: config
                    };
                    responses.push(response);
                    //Lägg tillbaka i oskickat
                    failed.push(data);
                    localStorage.oskickat = JSON.stringify(failed);
                    console.log("1.1.0");
                    //Kolla om det finns mer att skicka
                    if (dataArray.length === 0) {
                        //Skicka tillbaka responses för hantering
                        console.log("1.1.1");
                        deferred.resolve(responses);
                    } else {
                        //Skicka nästa
                        console.log("1.1.2");
                        postData();
                    }
                });
            }
            //Initiera
            postData();
        } else {
            //Inget att skicka
            deferred.resolve([]);
        }
        return deferred.promise;
    };
});