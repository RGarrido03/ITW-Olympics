// ViewModel KnockOut
var vm = function () {
    console.log('ViewModel initiated...');
    //---Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/Olympics/api/competitions');
    //self.baseUri = ko.observable('http://localhost:62595/api/drivers');
    self.displayName = 'Olympic Competitions List';
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');
    self.records = ko.observableArray([]);
    self.currentPage = ko.observable(1);
    self.pagesize = ko.observable(20);
    self.totalRecords = ko.observable(50);
    self.hasPrevious = ko.observable(false);
    self.hasNext = ko.observable(false);
    self.previousPage = ko.computed(function () {
        return self.currentPage() * 1 - 1;
    }, self);
    self.nextPage = ko.computed(function () {
        return self.currentPage() * 1 + 1;
    }, self);
    self.fromRecord = ko.computed(function () {
        return self.previousPage() * self.pagesize() + 1;
    }, self);
    self.toRecord = ko.computed(function () {
        return Math.min(self.currentPage() * self.pagesize(), self.totalRecords());
    }, self);
    self.totalPages = ko.observable(0);
    self.pageArray = function () {
        var list = [];
        var size = Math.min(self.totalPages(), 9);
        var step;
        if (size < 9 || self.currentPage() === 1)
            step = 0;
        else if (self.currentPage() >= self.totalPages() - 4)
            step = self.totalPages() - 9;
        else
            step = Math.max(self.currentPage() - 5, 0);

        for (var i = 1; i <= size; i++)
            list.push(i + step);
        return list;
    };

    //--- Page Events
    self.activate = function () {
        console.log('CALL: getCompetitions...');
        var composedUri = self.baseUri() + "?page=1&pageSize=" + self.pagesize();
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            hideLoading();
            self.records(data.Records);
            self.currentPage(data.CurrentPage);
            self.hasNext(data.HasNext);
            self.hasPrevious(data.HasPrevious);
            self.pagesize(data.PageSize)
            self.totalPages(data.TotalPages);
            self.totalRecords(data.TotalRecords);
            //self.SetFavourites();
        });
        loading = false;
    };

    self.order = ko.observable(0);
    self.count = ko.observable(1);
    self.setNewOrder = function () {
        self.order($("#orderSelect option").filter(':selected').val());
        if (self.order() == '0') {
            self.count(1);
        } else {
            self.count(self.totalPages());
        }

        var composedUri = self.baseUri() + "?page=" + self.count() + "&pageSize=" + self.pagesize();
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            if (self.order() == 0) {
                self.records(data.Records);
            } else {
                self.records(data.Records.reverse());
            }
            self.currentPage(data.CurrentPage);
            self.hasNext(data.HasNext);
            self.hasPrevious(data.HasPrevious);
            self.pagesize(data.PageSize)
            self.totalPages(data.TotalPages);
            self.totalRecords(data.TotalRecords);
            //self.SetFavourites();
            loading = false;
        });
    }

    self.fetchMoreData = function () {
        if (loading == false) {
            if (self.order() == 0) {
                self.count(self.count() + 1);
            } else {
                self.count(self.count() - 1);
            }
            loading = true;
            var composedUri = self.baseUri() + "?page=" + self.count() + "&pageSize=" + self.pagesize();
            ajaxHelper(composedUri, 'GET').done(function (data) {
                console.log(data);
                if (self.order() == 0) {
                    self.records(self.records().concat(data.Records));
                } else {
                    self.records(self.records().concat(data.Records.reverse()));
                }
                self.currentPage(data.CurrentPage);
                self.hasNext(data.HasNext);
                self.hasPrevious(data.HasPrevious);
                self.pagesize(data.PageSize)
                self.totalPages(data.TotalPages);
                self.totalRecords(data.TotalRecords);
                //self.SetFavourites();
                loading = false;
            });
        }
    };

    var typingTimeout;
    self.searchChanged = function () {
        var searchQuery = $(event.target).val();

        if (searchQuery.length > 0) {
            if (typingTimeout) {
                clearTimeout(typingTimeout);
            }
            typingTimeout = setTimeout(function () {
                $.get("http://192.168.160.58/Olympics/api/Competitions/SearchByName", {
                    q: searchQuery
                }, function (data) {
                    console.log(data);
                    if (self.order() == 0) {
                        self.records(data);
                    } else {
                        self.records(data.reverse());
                    }
                });
            }, 1000);
        }
        else {
            clearTimeout(typingTimeout);
            self.setNewOrder();
        }
    };

    self.closeAutocompleteList = function () {
        $("#AutocompleteList").fadeOut("fast");
    };

    $(window).scroll(function () {
        if ($(window).scrollTop() == 0) {
            $("#scrollToTop").slideUp('fast');
        } else {
            $("#scrollToTop").slideDown('fast');
        }
        
        if (($(window).scrollTop() + $(window).height() > $(document).height() - 425) && $("#searchInput").val().length == 0) {
            count = self.fetchMoreData();
        }
        return true;
    });

    self.scrollToTop = function () {
        $('html, body').animate({ scrollTop: 0 }, 'fast');
    };

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

    function getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;
        console.log("sPageURL=", sPageURL);
        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
    };

    //--- start ....
    var loading = true;
    showLoading();
    self.activate();
    console.log("VM initialized!");
};

function showButtons() {
    $(event.target).children(".card-action-buttons").fadeTo('fast', 1.0);
}

function hideButtons() {
    $(event.target).children(".card-action-buttons").fadeTo('fast', 0.0);
}

$(document).ready(function () {
    console.log("ready!");
    ko.applyBindings(new vm());
});

$(document).ajaxComplete(function (event, xhr, options) {
    $("#myModal").modal('hide');
})