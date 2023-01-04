// ViewModel KnockOut
var vm = function () {
    console.log('ViewModel initiated...');
    //---Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/Olympics/api/Athletes/');
    self.displayName = 'Olympic Athlete Details';
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');
    //--- Data Record
    self.Id = ko.observable(0);
    self.Name = ko.observable('');
    self.Sex = ko.observable('');
    self.Height = ko.observable('');
    self.Weight = ko.observable('');
    self.BornDate = ko.observable('');
    self.BornPlace = ko.observableArray('');
    self.Birth = ko.computed({
        read: function () {
            if (self.BornDate() == null || self.BornDate() == '' && self.BornPlace() == null || self.BornPlace() == '') {
                return "NA";
            } else if (self.BornDate() == null || self.BornDate() == '') {
                return self.BornPlace();
            } else if (self.BornPlace() == null || self.BornPlace() == '') {
                return self.BornDate();
            } else {
                return self.BornDate() + ", " + self.BornPlace();
            }
        },
        write: function (value, value_b) {
            self.BornDate(value);
            self.BornPlace(value_b);
        }
    });
    self.DiedDate = ko.observable('');
    self.DiedPlace = ko.observable('');
    self.Death = ko.computed({
        read: function () {
            if (self.DiedDate() == null || self.DiedDate() == '' && self.DiedPlace() == null || self.DiedPlace() == '') {
                return "NA";
            } else if (self.DiedDate() == null || self.DiedDate() == '') {
                return self.DiedPlace();
            } else if (self.DiedPlace() == null || self.DiedPlace() == '') {
                return self.DiedDate();
            } else {
                return self.DiedDate() + ", " + self.DiedPlace();
            }
        },
        write: function (value, value_b) {
            self.DiedDate(value);
            self.DiedPlace(value_b);
        }
    });
    self.Photo = ko.observable('');
    self.OlympediaLink = ko.observable('');
    self.Summary = ko.observable(true);
    self.Games = ko.observableArray([]);
    self.Modalities = ko.observableArray([]);
    self.Competitions = ko.observableArray([]);
    self.Medals = ko.observableArray([]);
    self.Favorites = {
        "athletes": [],
        "countries": [],
        "competitions": [],
        "games": [],
        "modalities": []
    }
    self.FavoritesAthletesArray = ko.observableArray([]);
    self.FavoritesGamesArray = ko.observableArray([]);
    self.FavoritesModalitiesArray = ko.observableArray([]);
    self.FavoritesCompetitionsArray = ko.observableArray([]);

    //--- Page Events
    self.getFavorites = function () {
        if (localStorage.getItem("Favorites")) {
            self.Favorites = JSON.parse(localStorage.getItem("Favorites"));
        } else {
            localStorage.setItem("Favorites", JSON.stringify(self.Favorites));
        }
        console.log("Current favorites: ", self.Favorites);

        self.FavoritesAthletesArray(self.Favorites.athletes);
        self.FavoritesGamesArray(self.Favorites.games);
        self.FavoritesModalitiesArray(self.Favorites.modalities);
        self.FavoritesCompetitionsArray(self.Favorites.competitions);

        if (self.FavoritesAthletesArray().includes(id)) {
            $("#fav_athletes_" + id).addClass("text-danger").removeClass("text-body");
        }
        self.FavoritesCompetitionsArray().forEach(function (item) {
            $("#fav_competitions_" + item).addClass("text-danger").removeClass("text-body-secondary");
        });
        self.FavoritesGamesArray().forEach(function (item) {
            $("#fav_games_" + item).addClass("text-danger").removeClass("text-body-secondary");
        });
        self.FavoritesModalitiesArray().forEach(function (item) {
            $("#fav_modalities_" + item).addClass("text-danger").removeClass("text-body-secondary");
        });
    };

    self.setAthletesFavorites = function (id) {
        var idx = self.FavoritesAthletesArray.indexOf(id.toString());
        if (idx == -1) {
            $("#fav_athletes_" + id).addClass("text-danger").removeClass("text-body");
            self.FavoritesAthletesArray.push(String(id))
        } else {
            $("#fav_athletes_" + id).removeClass("text-danger").addClass("text-body");
            self.FavoritesAthletesArray.splice(idx, 1);
        };
        console.log("Athletes favorites: ", self.FavoritesAthletesArray());
        localStorage.setItem('Favorites', JSON.stringify(self.Favorites))
    };

    self.setGamesFavorites = function (id) {
        var idx = self.FavoritesGamesArray.indexOf(id.toString());
        if (idx == -1) {
            $("#fav_games_" + id).addClass("text-danger").removeClass("text-body-secondary");
            self.FavoritesGamesArray.push(String(id))
        } else {
            $("#fav_games_" + id).removeClass("text-danger").addClass("text-body-secondary");
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

    self.activate = async function (id) {
        console.log('Athelete ID: ' + id);
        var composedUri = self.baseUri() + id;
        await ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            hideLoading();
            self.Id(data.Id);
            self.Name(data.Name);
            self.Sex(data.Sex);
            self.Height(data.Height);
            self.Weight(data.Weight);
            self.BornDate(data.BornDate ? new Date(data.BornDate).toLocaleDateString("pt-PT") : null);
            self.BornPlace(data.BornPlace);
            self.DiedDate(data.DiedDate ? new Date(data.DiedDate).toLocaleDateString("pt-PT"): null);
            self.DiedPlace(data.DiedPlace);
            self.OlympediaLink(data.OlympediaLink);
            self.Photo(data.Photo);
            self.getFavorites();
        });
    };

    self.getMoreData = async function () {
        console.log("Getting full details of game with ID " + self.Id());
        showLoading();
        var composedUri = self.baseUri() + "FullDetails?id=" + id;
        await ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);

            self.Id(data.Id);
            self.Name(data.Name);
            self.Sex(data.Sex);
            self.Height(data.Height);
            self.Weight(data.Weight);
            self.BornDate(data.BornDate ? new Date(data.BornDate).toLocaleDateString("pt-PT") : null);
            self.BornPlace(data.BornPlace);
            self.DiedDate(data.DiedDate ? new Date(data.DiedDate).toLocaleDateString("pt-PT"): null);
            self.DiedPlace(data.DiedPlace);
            self.OlympediaLink(data.OlympediaLink);
            self.Photo(data.Photo);

            self.Summary(false);
            self.Games(data.Games);
            self.Modalities(data.Modalities);
            self.Competitions(data.Competitions);
            self.Medals(data.Medals);
            self.getFavorites();
            hideLoading();
            self.addMarkers();
        });
    };

    self.scrollToTop = function () {
        $('html, body').animate({ scrollTop: 0 }, 'fast');
    };

    self.goBack = function () {
        if (window.history.length > 1) {
            history.back();
        } else {
            window.location.href = '/athletes.html';
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

        await self.Games().forEach(function (record) {
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