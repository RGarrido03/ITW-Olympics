// ViewModel KnockOut
var vm = function () {
    console.log('ViewModel initiated...');
    //---Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/Olympics/api/countries/');
    self.displayName = 'Olympic Countries edition Details';
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');
    //--- Data Record
    self.Id = ko.observable('');
    self.IOC = ko.observable('');
    self.Flag = ko.observable('');
    self.Name = ko.observable('');
    self.Participant = ko.observableArray([]);
    self.Organizer = ko.observableArray([]);
    self.Events = ko.observableArray([]);
    self.Url = ko.observable('');
    self.Medals = ko.observableArray([]);
    self.MedalsGames = ko.observableArray([]);
    self.MedalsGold = ko.observableArray([]);
    self.MedalsSilver = ko.observableArray([]);
    self.MedalsBronze = ko.observableArray([]);
    self.Favorites = {
        "athletes": [],
        "countries": [],
        "competitions": [],
        "games": [],
        "modalities": []
    }
    self.FavoritesCountriesArray = ko.observableArray([]);
    self.FavoritesGamesArray = ko.observableArray([]);
    self.FavoritesCompetitionsArray = ko.observableArray([]);

    //--- Page Events
    self.getFavorites = function () {
        if (localStorage.getItem("Favorites")) {
            self.Favorites = JSON.parse(localStorage.getItem("Favorites"));
        } else {
            localStorage.setItem("Favorites", JSON.stringify(self.Favorites));
        }
        console.log("Current favorites: ", self.Favorites);

        self.FavoritesCountriesArray(self.Favorites.countries);
        self.FavoritesGamesArray(self.Favorites.games);
        self.FavoritesCompetitionsArray(self.Favorites.competitions);

        if (self.FavoritesCountriesArray().includes(id)) {
            $("#fav_countries_" + id).addClass("text-danger").removeClass("text-body");
        }
        self.FavoritesCompetitionsArray().forEach(function (item) {
            $("#fav_competitions_" + item).addClass("text-danger").removeClass("text-body-secondary");
        });
        self.FavoritesGamesArray().forEach(function (item) {
            $("#fav_games_" + item).addClass("text-danger").removeClass("text-body-secondary");
            $("#fav_games_org_" + item).addClass("text-danger").removeClass("text-body-secondary");
        });
    };

    self.setCountriesFavorites = function (id) {
        var idx = self.FavoritesCountriesArray.indexOf(id.toString());
        if (idx == -1) {
            $("#fav_countries_" + id).addClass("text-danger").removeClass("text-body");
            self.FavoritesCountriesArray.push(String(id))
        } else {
            $("#fav_countries_" + id).removeClass("text-danger").addClass("text-body");
            self.FavoritesCountriesArray.splice(idx, 1);
        };
        console.log("Countries favorites: ", self.FavoritesCountriesArray());
        localStorage.setItem('Favorites', JSON.stringify(self.Favorites))
    };

    self.setGamesFavorites = function (id) {
        var idx = self.FavoritesGamesArray.indexOf(id.toString());
        if (idx == -1) {
            $("#fav_games_" + id).addClass("text-danger").removeClass("text-body-secondary");
            $("#fav_games_org_" + id).addClass("text-danger").removeClass("text-body-secondary");
            self.FavoritesGamesArray.push(String(id))
        } else {
            $("#fav_games_" + id).removeClass("text-danger").addClass("text-body-secondary");
            $("#fav_games_org_" + id).removeClass("text-danger").addClass("text-body-secondary");
            self.FavoritesGamesArray.splice(idx, 1);
        };
        console.log("Games favorites: ", self.FavoritesGamesArray());
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
        console.log('Country ID: ' + id);
        var composedUri = self.baseUri() + id;
        await ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            hideLoading();
            self.Id(data.Id);
            self.IOC(data.IOC);
            self.Flag(data.Flag);
            self.Name(data.Name);
            self.Participant(data.Participant);
            self.Organizer(data.Organizer);
            self.Events(data.Events);
            self.addMarkers();
            self.getFavorites();
            ajaxHelper('http://192.168.160.58/Olympics/api/Statistics/Medals_Games?id=' + id, 'GET').done(function (data) {
                console.log(data);
                self.Medals(data);
                self.Medals().forEach(function (record) {
                    self.MedalsGames.push(record.GameName.slice(0, 4));
                    self.MedalsGold.push(record.Medals[0].Counter);
                    self.MedalsSilver.push(record.Medals[1].Counter);
                    self.MedalsBronze.push(record.Medals[2].Counter);
                });
                self.createGraph();
            });
        });
    };

    self.createGraph = function () {
        const ctx = document.getElementById('MedalsPerCountryChart');

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: self.MedalsGames(),
                datasets: [{
                    label: 'Gold',
                    data: self.MedalsGold(),
                    borderWidth: 1
                },
                {
                    label: 'Silver',
                    data: self.MedalsSilver(),
                    borderWidth: 1
                },
                {
                    label: 'Bronze',
                    data: self.MedalsBronze(),
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        stacked: true,
                    },
                    x: {
                        stacked: true
                    }
                }
            }
        });
    }

    self.scrollToTop = function () {
        $('html, body').animate({ scrollTop: 0 }, 'fast');
    };

    self.goBack = function () {
        if (window.history.length > 1) {
            history.back();
        } else {
            window.location.href = '/countries.html';
        }
    };

    $(window).on("resize scroll", function () {
        if ($(window).scrollTop() == 0) {
            $("#scrollToTop").slideUp('fast');
        } else {
            $("#scrollToTop").slideDown('fast');
        }
        return true;
    });

    self.addMarkers = async function () {
        var mcgLayerSupportGroup = L.markerClusterGroup.layerSupport();
        mcgLayerSupportGroup.addTo(map);

        var summer = L.layerGroup().addTo(map);
        var winter = L.layerGroup().addTo(map);

        await self.Participant().forEach(function (record) {
            var marker = L.marker([record.Lat, record.Lon], { alt: record.Name }).addTo(map);
            marker.bindPopup("<b>" + record.Name + "</b><br>" + record.CityName);
            if (record.Name.includes('Summer')) {
                summer.addLayer(marker);
            } else {
                winter.addLayer(marker);
            }
        });

        mcgLayerSupportGroup.checkIn(summer);
        mcgLayerSupportGroup.checkIn(winter);
        summer.addTo(map);
        winter.addTo(map);
        
        var overlay = {'Summer': summer, 'Winter': winter};
        L.control.layers(null, overlay).addTo(map);
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