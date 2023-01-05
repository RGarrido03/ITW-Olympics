// ViewModel KnockOut
var vm = function () {
    console.log('ViewModel initiated...');
    //---Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/Olympics/api/athletes');
    self.displayName = 'Olympic Athletes List';
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');
    self.records = ko.observableArray([]);
    self.currentPage = ko.observable(1);
    self.pagesize = ko.observable(20);
    self.totalRecords = ko.observable(50);
    self.hasPrevious = ko.observable(false);
    self.hasNext = ko.observable(false);
    self.totalPages = ko.observable(0);
    self.sortby = ko.observable('');
    self.count = ko.observable(1);
    self.hasMore = ko.observable(true);
    self.searchLoading = ko.observable(false);
    self.countryRecords = ko.observableArray([]);
    self.filter = ko.observable('');
    self.searchLoading = ko.observable(false);
    self.Favorites = {
        "athletes": [],
        "countries": [],
        "competitions": [],
        "games": [],
        "modalities": []
    }
    self.FavoritesArray = ko.observableArray([]);

    self.History = {
        "athletes": [],
        "countries": [],
        "competitions": [],
        "games": [],
        "modalities": [],
        "all": []
    }
    self.HistoryAthletesArray = ko.observableArray([]);
    self.showHistory = ko.observable(false);

    //--- Page Events
    self.getHistory = function () {
        if (localStorage.getItem("History")) {
            self.History = JSON.parse(localStorage.getItem("History"));
        } else {
            localStorage.setItem("History", JSON.stringify(self.History));
        }
        console.log("Current history: ", self.History);
        self.HistoryAthletesArray(self.History.athletes);
    };

    self.showHistoryTrue = function () {
        console.log("AAAAA")
        self.showHistory(true);
        return true;
    }

    self.showHistoryFalse = function () {
        self.showHistory(false);
    }

    self.deleteEntry = function (itemName) {
        var idx = self.HistoryAthletesArray.indexOf(itemName);
        self.HistoryAthletesArray.splice(idx, 1);
        
        localStorage.setItem("History", JSON.stringify(self.History));
    }

    self.getFavorites = function () {
        if (localStorage.getItem("Favorites")) {
            self.Favorites = JSON.parse(localStorage.getItem("Favorites"));
        } else {
            localStorage.setItem("Favorites", JSON.stringify(self.Favorites));
        }
        console.log("Current favorites: ", self.Favorites);

        self.FavoritesArray(self.Favorites.athletes);
        console.log("Favorite athletes: ", self.FavoritesArray());
        self.FavoritesArray().forEach(function (id) {
            $("#fav" + id).addClass("text-danger").removeClass("text-body");
        });
    };

    self.setFavorites = function (id) {
        console.log(id)
        var idx = self.FavoritesArray.indexOf(id.toString());
        if (idx == -1) {
            $("#fav" + id).addClass("text-danger").removeClass("text-body");
            self.FavoritesArray.push(String(id))
        } else {
            $("#fav" + id).removeClass("text-danger").addClass("text-body");
            self.FavoritesArray.splice(idx, 1);
        };
        console.log(self.FavoritesArray());
        console.log(self.Favorites);
        localStorage.setItem('Favorites', JSON.stringify(self.Favorites))
    };


    self.fetchData = async function (isNew, IOC) {
        if (isNew) {
            IOC ? self.filter(IOC) : self.filter('');
            self.sortby($("#sortBySelect option").filter(':selected').val());
            self.count(1);
        } else {
            if (loading) {
                return;
            } else {
                if (self.hasNext()) {
                    self.count(self.count() + 1);
                } else {
                    return;
                }
                loading = true;
            }
        }

        var composedUri = self.baseUri() + (self.filter() ? ("/ByIOC?ioc=" + self.filter() + "&") : "?") + "page=" + self.count() + "&pageSize=" + self.pagesize() + "&sortby=" + self.sortby();
        console.log(composedUri);
        await ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            self.hasNext(data.HasNext);
            isNew ? self.records(data.Records) : self.records(self.records().concat(data.Records));
            self.currentPage(data.CurrentPage);
            self.pagesize(data.PageSize);
            self.totalPages(data.TotalPages);
            self.totalRecords(data.TotalRecords);
            hideLoading();
            self.getFavorites();
            loading = false;
            self.searchLoading(false);
        });

        if (($(window).scrollTop() + $(window).height() > $(document).height() - 425) && $("#searchInput").val().length == 0) {
            self.fetchData(false);
        }
    }

    self.fetchCountriesData = async function () {
        await ajaxHelper("http://192.168.160.58/Olympics/api/countries?page=1&pageSize=500", 'GET').done(function (data) {
            console.log(data);
            self.hasNext(data.HasNext);
            self.hasPrevious(data.HasPrevious);
            self.countryRecords(data.Records);
        });
    }

    var typingTimeout;
    self.searchChanged = function (event) {
        var searchQuery = $(event.target).val();
        if ($("#searchInput").val() != searchQuery) {
            $("#searchInput").val(searchQuery);
        }

        if (searchQuery.length >= 3) {
            if (typingTimeout) {
                clearTimeout(typingTimeout);
            }
            typingTimeout = setTimeout(function () {
                self.searchLoading(true);
                self.showHistory(false);
                self.hasMore(false);
                ajaxHelper(self.baseUri() + "/SearchByName", 'GET', { q: searchQuery }).done(function (data) {
                    console.log(data);
                    self.records(data);
                    self.searchLoading(false);
                    self.getFavorites();
                });
                var idx = self.HistoryAthletesArray.indexOf(searchQuery);
                if (idx == -1) {
                    self.HistoryAthletesArray.push(String(searchQuery));
                }
                console.log(self.History);
                localStorage.setItem('History', JSON.stringify(self.History))
            }, 1000);
        }
        else if (searchQuery.length == 0) {
            self.searchLoading(true);
            clearTimeout(typingTimeout);
            self.fetchData(true);
            self.getHistory();
            self.showHistory(true);
            self.searchLoading(false);
        }
    };

    self.filterCountry = function () {
        if ($(event.target).is("input")) {
            var countryIOC = $(event.target)[0].id.slice(1, 4);
            console.log(countryIOC);
            self.fetchData(true, countryIOC);
            $("#searchInput").attr("disabled", true);
            $("#sortBySelect").attr("disabled", true);
            $("#filterBtn").removeClass("bg-body-tertiary").addClass("bg-success-subtle border-success-subtle");
        }
        return true
    }

    self.clearCountrySelection = function () {
        $('[name="flexRadioDefault"]').prop('checked', false);
        $("#searchInput").attr("disabled", false);
        $("#sortBySelect").attr("disabled", false);
        $("#filterBtn").removeClass("bg-success-subtle border-success-subtle").addClass("bg-body-tertiary");
        self.fetchData(true);
    }

    $(window).on("resize scroll", function () {
        if ($(window).scrollTop() == 0) {
            $("#scrollToTop").slideUp('fast');
        } else {
            $("#scrollToTop").slideDown('fast');
        }

        if (($(window).scrollTop() + $(window).height() > $(document).height() - 425) && $("#searchInput").val().length == 0) {
            self.fetchData(false);
        }
        return true;
    });

    self.scrollToTop = function () {
        $('html, body').animate({ scrollTop: 0 }, 'fast');
    };

    self.toggleButtons = function (event, action) {
        $(event.target).fadeTo('fast', action == "show" ? 1.0 : 0.0);
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
                self.searchLoading(false);
            }
        });
    }

    function sleep(milliseconds) {
        const start = Date.now();
        while (Date.now() - start < milliseconds);
    }

    function showLoading() {
        $("#myModal").modal('show', {
            backdrop: 'static',
            keyboard: false
        });
    }
    function hideLoading() {
        $('#myModal').on('shown.bs.modal', function (e) {
            $("#myModal").modal('hide');
        })
    }

    //--- start ....
    var loading = true;
    showLoading();
    self.fetchData(true);
    self.fetchCountriesData();
    console.log("VM initialized!");
    self.getHistory();
};

$(document).ready(function () {
    ko.applyBindings(new vm());
});

$(document).ajaxComplete(function (event, xhr, options) {
    $("#myModal").modal('hide');
})