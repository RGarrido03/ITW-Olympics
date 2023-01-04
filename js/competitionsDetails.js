// ViewModel KnockOut
var vm = function () {
    console.log('ViewModel initiated...');
    //---Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/Olympics/api/Competitions/');
    self.displayName = 'Olympic Competition details';
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');
    //--- Data Record
    self.Id = ko.observable('');
    self.Name = ko.observable('');
    self.ModalityId = ko.observable(0);
    self.Modality = ko.observable('');
    self.ModalityLink = ko.observable('');
    self.ModalityLink = ko.pureComputed({
        read: function () {
            return './modalitiesDetails.html?id=' + self.ModalityId();
        },
        write: function (value) {
            self.ModalityId(value);
        }
    }),
    self.Photo = ko.observable('');
    self.Games = ko.observableArray([]);
    self.Favorites = {
        "athletes": [],
        "countries": [],
        "competitions": [],
        "games": [],
        "modalities": []
    }
    self.FavoritesCompetitionsArray = ko.observableArray([]);
    self.FavoritesGamesArray = ko.observableArray([]);

    //--- Page Events
    self.getFavorites = function () {
        if (localStorage.getItem("Favorites")) {
            self.Favorites = JSON.parse(localStorage.getItem("Favorites"));
        } else {
            localStorage.setItem("Favorites", JSON.stringify(self.Favorites));
        }
        console.log("Current favorites: ", self.Favorites);

        self.FavoritesCompetitionsArray(self.Favorites.competitions);
        self.FavoritesGamesArray(self.Favorites.games);

        if (self.FavoritesCompetitionsArray().includes(id)) {
            $("#fav_competitions_" + id).addClass("text-danger").removeClass("text-body");
        }
        self.FavoritesGamesArray().forEach(function (item) {
            $("#fav_games_" + item).addClass("text-danger").removeClass("text-body-secondary");
        });
    };

    self.setCompetitionsFavorites = function (id) {
        var idx = self.FavoritesCompetitionsArray.indexOf(id.toString());
        if (idx == -1) {
            $("#fav_competitions_" + id).addClass("text-danger").removeClass("text-body");
            self.FavoritesCompetitionsArray.push(String(id))
        } else {
            $("#fav_competitions_" + id).removeClass("text-danger").addClass("text-body");
            self.FavoritesCompetitionsArray.splice(idx, 1);
        };
        console.log("Competitions favorites: ", self.FavoritesCompetitionsArray());
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

    self.activate = async function (id) {
        console.log("Competition ID: " + id);
        var composedUri = self.baseUri() + id;
        await ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            hideLoading();
            self.Id(data.Id);
            self.Name(data.Name);
            self.ModalityId(data.ModalityId);
            self.Modality(data.Modality);
            self.ModalityLink(data.ModalityId);
            self.Photo(data.Photo);
            self.Games(data.Participant);
            self.getFavorites();
        });
    };

    self.scrollToTop = function () {
        $('html, body').animate({ scrollTop: 0 }, 'fast');
    };

    self.goBack = function () {
        if (window.history.length > 1) {
            history.back();
        } else {
            window.location.href = '/competitions.html';
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

    //--- Internal functions
    function ajaxHelper(uri, method, data) {
        self.error(''); // Clear error message
        return $.ajax({
            type: method,
            url: uri,
            dataType: 'json',
            contentType: 'application/json',
            data: data ? JSON.stringify(data) : null,
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
    console.log("VM initialized!");
};

$(document).ready(function () {
    console.log("document.ready!");
    ko.applyBindings(new vm());
});

$(document).ajaxComplete(function (event, xhr, options) {
    $("#myModal").modal('hide');
})