// ViewModel KnockOut
var vm = function () {
    console.log('ViewModel initiated...');
    //---Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/Olympics/api/');
    self.displayName = 'Check your favorites';
    self.error = ko.observable('');
    self.AthletesRecords = ko.observableArray([]);
    self.CompetitionsRecords = ko.observableArray([]);
    self.CountriesRecords = ko.observableArray([]);
    self.GamesRecords = ko.observableArray([]);
    self.ModalitiesRecords = ko.observableArray([]);

    self.Favorites = {
        "athletes": [],
        "countries": [],
        "competitions": [],
        "games": [],
        "modalities": []
    }
    self.FavoritesAthletesArray = ko.observableArray([]);
    self.FavoritesCompetitionsArray = ko.observableArray([]);
    self.FavoritesCountriesArray = ko.observableArray([]);
    self.FavoritesGamesArray = ko.observableArray([]);
    self.FavoritesModalitiesArray = ko.observableArray([]);
    self.Id = ko.observable(id);
    self.shownArray = ko.observableArray([]);

    self.getAllFavorites = function () {
        if (localStorage.getItem("Favorites")) {
            self.Favorites = JSON.parse(localStorage.getItem("Favorites"));
        } else {
            localStorage.setItem("Favorites", JSON.stringify(self.Favorites));
        }
        console.log("Current favorites: ", self.Favorites);

        self.FavoritesAthletesArray(self.Favorites.athletes);
        self.FavoritesCompetitionsArray(self.Favorites.competitions);
        self.FavoritesCountriesArray(self.Favorites.countries);
        self.FavoritesGamesArray(self.Favorites.games);
        self.FavoritesModalitiesArray(self.Favorites.modalities);
    };

    self.getSpecificFavorites = async function (id) {
        console.log('Current id:', id);
        switch (id) {
            case 'athletes':
                $('#choosing_select option').prop('selected', false);
                $('#choosing_select option[value="athletes"]').prop('selected', true);
                if (self.AthletesRecords().length == 0) {
                    showLoading();
                    for (const item of self.FavoritesAthletesArray()) {
                        await ajaxHelper(self.baseUri() + 'Athletes/' + item, 'GET').done(function (data) {
                            console.log("Athlete: ", data)
                            self.AthletesRecords.push({'name': data.Name, 'id': data.Id, 'photo': data.Photo, 'placeholder': 'fa-user', 'link': 'athletes'});
                        });
                    };
                }
                self.shownArray(self.AthletesRecords());
                break;
            case 'competitions':
                $('#choosing_select option').prop('selected', false);
                $('#choosing_select option[value="competitions"]').prop('selected', true);
                if (self.CompetitionsRecords().length == 0) {
                    showLoading();
                    for (const item of self.FavoritesCompetitionsArray()) {
                        await ajaxHelper(self.baseUri() + 'Competitions/' + item, 'GET').done(function (data) {
                            console.log("Competition: ", data)
                            self.CompetitionsRecords.push({'name': data.Name, 'id': data.Id, 'photo': data.Photo, 'placeholder': 'fa-trophy', 'link': 'competitions'});
                        });
                    };
                }
                self.shownArray(self.CompetitionsRecords());
                break;
            case 'countries':
                $('#choosing_select option').prop('selected', false);
                $('#choosing_select option[value="countries"]').prop('selected', true);
                if (self.CountriesRecords().length == 0) {
                    showLoading();
                    for (const item of self.FavoritesCountriesArray()) {
                        await ajaxHelper(self.baseUri() + 'Countries/' + item, 'GET').done(function (data) {
                            console.log("Country: ", data)
                            self.CountriesRecords.push({'name': data.Name, 'id': data.Id, 'photo': data.Flag, 'placeholder': 'fa-flag', 'link': 'countries'});
                        });
                    };
                }
                self.shownArray(self.CountriesRecords());
                break;
            case 'games':
                $('#choosing_select option').prop('selected', false);
                $('#choosing_select option[value="games"]').prop('selected', true);
                if (self.GamesRecords().length == 0) {
                    showLoading();
                    for (const item of self.FavoritesGamesArray()) {
                        await ajaxHelper(self.baseUri() + 'Games/' + item, 'GET').done(function (data) {
                            console.log("Game: ", data)
                            self.GamesRecords.push({'name': data.Name, 'id': data.Id, 'photo': data.Photo, 'placeholder': 'fa-location-pin', 'link': 'games'});
                        });
                    };
                }
                self.shownArray(self.GamesRecords());
                break;
            case 'modalities':
                $('#choosing_select option').prop('selected', false);
                $('#choosing_select option[value="modalities"]').prop('selected', true);
                if (self.ModalitiesRecords().length == 0) {
                    showLoading();
                    for (const item of self.FavoritesModalitiesArray()) {
                        await ajaxHelper(self.baseUri() + 'Modalities/' + item, 'GET').done(function (data) {
                            console.log("Modality: ", data)
                            self.ModalitiesRecords.push({'name': data.Name, 'id': data.Id, 'photo': data.Photo, 'placeholder': 'fa-futbol', 'link': 'modalities'});
                        });
                    };
                }
                self.shownArray(self.ModalitiesRecords());
                break;
            default:
                $('#choosing_select option').prop('selected', false);
                $('#choosing_select option[value="athletes"]').prop('selected', true);
                if (self.AthletesRecords().length == 0) {
                    showLoading();
                    for (const item of self.FavoritesAthletesArray()) {
                        await ajaxHelper(self.baseUri() + 'Athletes/' + item, 'GET').done(function (data) {
                            console.log("Athlete: ", data)
                            self.AthletesRecords.push({'name': data.Name, 'id': data.Id, 'photo': data.Photo, 'placeholder': 'fa-user', 'link': 'athletes'});
                        });
                    };
                }
                self.shownArray(self.AthletesRecords());
                break;
        }
        hideLoading();
    };

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
                self.error(errorThrown);
                const toast = new bootstrap.Toast($('#errorToast'));
                toast.show();
            }
        });
    }
    
    function getUrlHash() {
        var sPageURL = window.location.hash;
        
        return sPageURL.split('#')[1];
    };

    self.setURLHash = function (event) {
        console.log($(event.target).val());
        window.location.hash = '#' + $(event.target).val();
    }

    $(window).on('hashchange', function () {
        id = getUrlHash();
        self.getSpecificFavorites(id);
    });

    function showLoading() {
        console.log("showLoading");
        $('#myModal').modal('show', {
            backdrop: 'static',
            keyboard: false
        });
    }
    function hideLoading() {
        $("#myModal").modal('hide');
    }

    showLoading();
    var id = getUrlHash();
    self.getAllFavorites();
    self.getSpecificFavorites(id);
};

$(document).ready(function () {
    ko.applyBindings(new vm());
});