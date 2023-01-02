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

    //--- Page Events
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
        });
        var CountryEmojiName = self.CountryName() == "Great Britain" ? "United Kingdom" : self.CountryName();
        await ajaxHelper("https://api.emojisworld.fr/v1/search", 'GET', { "q": CountryEmojiName, limit: 1, categories: 10 }).done(function (data) {
            self.Emoji(data.results[0].emoji);
        });
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
        }).then(hideLoading());
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
            loading = false;
        }
    }

    self.getNewCompetitionsData = function () {
        if (!loading) {
            console.log("Getting more competitions...");
            loading = true;
            self.CompetitionsPage(self.CompetitionsPage() + 1);
            self.CompetitionsMin(self.CompetitionsMin().concat(self.Competitions().slice((self.CompetitionsPage() - 1) * 20, self.CompetitionsPage() * 20)));
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
    console.log("VM initialized!");
};

$(document).ready(function () {
    console.log("document.ready!");
    ko.applyBindings(new vm());
});

$(document).ajaxComplete(function (event, xhr, options) {
    $("#myModal").modal('hide');
})