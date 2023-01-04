// ViewModel KnockOut
var vm = function () {
    console.log('ViewModel initiated...');
    //---Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/Olympics/api/Games/');
    self.displayName = 'Olympic Game details';
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');
    //--- Data Record
    self.Id = ko.observable('');
    self.CountryName = ko.observable('');
    self.Logo = ko.observable('');
    self.Name = ko.observable('');
    self.Photo = ko.observable('');
    self.Season = ko.observable('');
    self.Year = ko.observableArray('');
    self.City = ko.observable('');
    self.Url = ko.observable('');
    self.Emoji = ko.observable('');
    self.Lon = ko.observable('');
    self.Lat = ko.observable('');
    self.Location = ko.computed({
        read: function () {
            return self.City() + ', ' + self.CountryName();
        },
        write: function (value, value_b) {
            self.City(value);
            self.CountryName(value_b);
        }
    });
    self.Summary = ko.observable(true);
    self.Athletes = ko.observableArray([]);
    self.AthletesPage = ko.observable(1);
    self.AthletesMin = ko.observableArray([]);
    self.Modalities = ko.observableArray([]);
    self.Competitions = ko.observableArray([]);
    self.CompetitionsPage = ko.observable(1);
    self.CompetitionsMin = ko.observableArray([]);
    self.Medals = ko.observableArray([]);
    self.Medals_country = ko.observableArray([]);

    self.MedalsPerCountry_CountryList = ko.observableArray([]);
    self.MedalsPerCountry_MedalsList = ko.observableArray([]);

    self.AthletesPerCountryArray = ko.observableArray([]);

    self.Favorites = {
        "athletes": [],
        "countries": [],
        "competitions": [],
        "games": [],
        "modalities": []
    };
    self.FavoritesGamesArray = ko.observableArray([]);
    self.FavoritesAthletesArray = ko.observableArray([]);
    self.FavoritesCompetitionsArray = ko.observableArray([]);
    self.FavoritesModalitiesArray = ko.observableArray([]);

    //--- Page Events
    self.getFavorites = function () {
        if (localStorage.getItem("Favorites")) {
            self.Favorites = JSON.parse(localStorage.getItem("Favorites"));
        } else {
            localStorage.setItem("Favorites", JSON.stringify(self.Favorites));
        }
        console.log("Current favorites: ", self.Favorites);

        self.FavoritesGamesArray(self.Favorites.games);
        self.FavoritesModalitiesArray(self.Favorites.modalities);
        self.FavoritesAthletesArray(self.Favorites.athletes);
        self.FavoritesCompetitionsArray(self.Favorites.competitions);

        if (self.FavoritesGamesArray().includes(id)) {
            $("#fav_games_" + id).addClass("text-danger").removeClass("text-body");
        }
        self.FavoritesModalitiesArray().forEach(function (item) {
            $("#fav_modalities_" + item).addClass("text-danger").removeClass("text-body-secondary");
        });
        self.FavoritesCompetitionsArray().forEach(function (item) {
            $("#fav_competitions_" + item).addClass("text-danger").removeClass("text-body-secondary");
        });
        self.FavoritesAthletesArray().forEach(function (item) {
            $("#fav_athletes_" + item).addClass("text-danger").removeClass("text-body-secondary");
            $("#fav_athletes_country_" + item).addClass("text-danger").removeClass("text-body-secondary");
        });
    };

    self.setGamesFavorites = function (id) {
        var idx = self.FavoritesGamesArray.indexOf(id.toString());
        if (idx == -1) {
            $("#fav_games_" + id).addClass("text-danger").removeClass("text-body");
            self.FavoritesGamesArray.push(String(id))
        } else {
            $("#fav_games_" + id).removeClass("text-danger").addClass("text-body");
            self.FavoritesGamesArray.splice(idx, 1);
        };
        console.log("Games favorites: ", self.FavoritesGamesArray());
        localStorage.setItem('Favorites', JSON.stringify(self.Favorites))
    };

    self.setModalitiesFavorites = function (id) {
        var idx = self.FavoritesModalitiesArray.indexOf(id.toString());
        if (idx == -1) {
            $("#fav_modalities_" + id).addClass("text-danger").removeClass("text-body-secondary");
            self.FavoritesModalitiesArray.push(String(id))
        } else {
            $("#fav_modalities_" + id).removeClass("text-danger").addClass("text-body-secondary");
            self.FavoritesModalitiesArray.splice(idx, 1);
        };
        console.log("Modalities favorites: ", self.FavoritesModalitiesArray());
        localStorage.setItem('Favorites', JSON.stringify(self.Favorites))
    };

    self.setAthletesFavorites = function (id) {
        var idx = self.FavoritesAthletesArray.indexOf(id.toString());
        if (idx == -1) {
            $("#fav_athletes_" + id).addClass("text-danger").removeClass("text-body-secondary");
            $("#fav_athletes_country_" + id).addClass("text-danger").removeClass("text-body-secondary");
            self.FavoritesAthletesArray.push(String(id))
        } else {
            $("#fav_athletes_" + id).removeClass("text-danger").addClass("text-body-secondary");
            $("#fav_athletes_country_" + id).removeClass("text-danger").addClass("text-body-secondary");
            self.FavoritesAthletesArray.splice(idx, 1);
        };
        console.log("Athletes favorites: ", self.FavoritesAthletesArray());
        localStorage.setItem('Favorites', JSON.stringify(self.Favorites))
    };

    self.setCompetitionsFavorites = function (id) {
        var idx = self.FavoritesCompetitionsArray.indexOf(id.toString());
        if (idx == -1) {
            $("#fav_competitions_" + id).addClass("text-danger").removeClass("text-body-secondary");
            self.FavoritesCompetitionsArray.push(String(id))
        } else {
            $("#fav_competitions_" + id).removeClass("text-danger").addClass("text-body-secondary");
            self.FavoritesCompetitionsArray.splice(idx, 1);
        };
        console.log("Competitions favorites: ", self.FavoritesCompetitionsArray());
        localStorage.setItem('Favorites', JSON.stringify(self.Favorites))
    };

    self.activate = async function (id) {
        console.log("Game ID: " + id);
        var composedUri = self.baseUri() + id;
        await ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            hideLoading();
            self.Id(data.Id);
            self.CountryName(data.CountryName);
            self.Logo(data.Logo);
            self.Name(data.Name);
            self.Photo(data.Photo);
            self.Season(data.Season);
            self.City(data.City);
            self.Year(data.Year);
            self.Lon(data.Lon);
            self.Lat(data.Lat);
            self.addMarkers();
            self.getFavorites();
        });
        await ajaxHelper("http://192.168.160.58/Olympics/api/Statistics/Medals_Country?id=" + id, 'GET').done(function (data) {
            console.log(data);
            self.Medals_country(data);
            $("#goldCounter").text('Counter: ' + self.Medals_country()[0].Medals[0].Counter);
            $("#silverCounter").text('Counter: ' + self.Medals_country()[0].Medals[1].Counter);
            $("#bronzeCounter").text('Counter: ' + self.Medals_country()[0].Medals[2].Counter);
            self.Medals_country().forEach(function (item) {
                self.MedalsPerCountry_CountryList.push(item.CountryName);
                self.MedalsPerCountry_MedalsList.push(item.Medals[0].Counter + item.Medals[1].Counter + item.Medals[2].Counter);
            });
            self.createGraph();
            self.getAthletesPerCountry(0);
        });
        var CountryEmojiName = self.CountryName() == "Great Britain" ? "United Kingdom" : self.CountryName();
        await ajaxHelper("https://api.emojisworld.fr/v1/search", 'GET', { "q": CountryEmojiName, limit: 1, categories: 10 }).done(function (data) {
            self.Emoji(data.results[0].emoji);
        });
    };

    self.countryChanged = function () {
        var countryID = $(event.target).val();
        $("#goldCounter").text('Counter: ' + self.Medals_country()[countryID].Medals[0].Counter);
        $("#silverCounter").text('Counter: ' + self.Medals_country()[countryID].Medals[1].Counter);
        $("#bronzeCounter").text('Counter: ' + self.Medals_country()[countryID].Medals[2].Counter);
        self.getAthletesPerCountry(countryID);
    };

    self.getMoreData = async function () {
        console.log("Getting full details of game with ID " + self.Id());
        showLoading();
        var composedUri = self.baseUri() + "FullDetails?id=" + id;
        await ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            self.Summary(false);
            self.Athletes(data.Athletes);
            self.AthletesMin(data.Athletes.slice(0,20));
            self.Modalities(data.Modalities);
            self.Competitions(data.Competitions);
            self.CompetitionsMin(data.Competitions.slice(0, 20));
            self.Medals(data.Medals);
            self.getFavorites();
            hideLoading();
        });
    };

    self.createGraph = function () {
        const ctx = document.getElementById('MedalsPerCountryChart');

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: self.MedalsPerCountry_CountryList(),
                datasets: [{
                    label: '# of Medals',
                    data: self.MedalsPerCountry_MedalsList(),
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    self.getAthletesPerCountry = function (id) {
        var countryID = self.Medals_country()[id].CountryId;
        ajaxHelper("http://192.168.160.58/Olympics/api/Countries/" + countryID, 'GET').done(function (data) {
            console.log(data);
            var countryIOC = data.IOC.slice(1,4);
            ajaxHelper("http://192.168.160.58/Olympics/api/Statistics/Athlete_Country?id=" + self.Id() + "&IOC=" + countryIOC, 'GET').done(function (data) {
                console.log(data);
                self.AthletesPerCountryArray(data);
                self.getFavorites();
            });
        });
    };

    self.scrollToTop = function () {
        $('html, body').animate({ scrollTop: 0 }, 'fast');
    };

    self.goBack = function () {
        if (window.history.length > 1) {
            history.back();
        } else {
            window.location.href = '/games.html';
        }
    };

    var loading = false;
    self.getNewAthletesData = function () {
        if (!loading) {
            console.log("Getting more athletes...");
            loading = true;
            self.AthletesPage(self.AthletesPage() + 1);
            self.AthletesMin(self.AthletesMin().concat(self.Athletes().slice((self.AthletesPage() - 1) * 20, self.AthletesPage() * 20)));
            self.getFavorites();
            loading = false;
        }
    }

    self.getNewCompetitionsData = function () {
        if (!loading) {
            console.log("Getting more competitions...");
            loading = true;
            self.CompetitionsPage(self.CompetitionsPage() + 1);
            self.CompetitionsMin(self.CompetitionsMin().concat(self.Competitions().slice((self.CompetitionsPage() - 1) * 20, self.CompetitionsPage() * 20)));
            self.getFavorites();
            loading = false;
        }
    }

    $(window).on("resize scroll", function () {
        if ($(window).scrollTop() == 0) {
            $("#scrollToTop").slideUp('fast');
        } else {
            $("#scrollToTop").slideDown('fast');
        }
        if ($(window).scrollTop() + $(window).height() > $(document).height() - 425) {
            if ($("#AthletesArray").attr("aria-expanded") == "true") {
                self.getNewAthletesData();
            } else if ($("#CompetitionsArray").attr("aria-expanded") == "true") {
                self.getNewCompetitionsData();
            }
        }
        return true;
    });

    self.addMarkers = async function () {
        console.log(self.Lat() + " " + self.Lon());
        var marker = L.marker([self.Lat(), self.Lon()], { alt: self.Name() }).addTo(map);
        marker.bindPopup("<b>" + self.Name() + "</b><br>" + self.City());
        map.setView([self.Lat(), self.Lon()], 5);
    }

    //--- Internal functions
    function ajaxHelper(uri, method, data) {
        self.error(''); // Clear error message
        return $.ajax({
            type: method,
            url: uri,
            dataType: 'json',
            contentType: 'application/json',
            data: data ? data : null,
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("AJAX Call[" + uri + "] Fail...");
                hideLoading();
                self.error(errorThrown);
                const toast = new bootstrap.Toast($('#errorToast'));
                toast.show();
            }
        });
    }

    function showLoading() {
        $('#myModal').modal('show', {
            backdrop: 'static',
            keyboard: false
        });
    }
    function hideLoading() {
        $('#myModal').on('shown.bs.modal', function (e) {
            $("#myModal").modal('hide');
        })
    }

    function getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
    };

    //--- start ....
    showLoading();
    var id = getUrlParameter('id');
    self.activate(id);

    var map = L.map('map', {zoomSnap: 0.25}).setView([28,0], 1.5);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    console.log("VM initialized!");
};

$(document).ready(function () {
    console.log("document.ready!");
    ko.applyBindings(new vm());
});

$(document).ajaxComplete(function (event, xhr, options) {
    $("#myModal").modal('hide');
})