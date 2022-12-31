// ViewModel KnockOut
var vm = function () {
    console.log('ViewModel initiated...');
    //---Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/Olympics/api/Competitions');
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
    self.order = ko.observable(0);
    self.count = ko.observable(1);
    self.hasMore = ko.observable(true);

    self.fetchData = async function (isNew) {
        if (isNew) {
            self.order($("#orderSelect option").filter(':selected').val());
            if (self.order() == '0') {
                self.count(1);
            } else {
                self.count(self.totalPages());
            }
        } else {
            if (loading) {
                return;
            } else {
                if (self.order() == 0) {
                    if (self.hasNext()) {
                        self.count(self.count() + 1);
                    } else {
                        return;
                    }
                } else {
                    if (self.hasPrevious()) {
                        self.count(self.count() - 1);
                    } else {
                        return;
                    }
                }
                loading = true;
            }
        }

        var composedUri = self.baseUri() + "?page=" + self.count() + "&pageSize=" + self.pagesize();
        await ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            self.hasNext(data.HasNext);
            self.hasPrevious(data.HasPrevious);
            if (isNew) {
                if (self.order() == 0) {
                    self.records(data.Records);
                } else {
                    self.records(data.Records.reverse());
                }
            } else {
                if (self.order() == 0) {
                    self.records(self.records().concat(data.Records));
                    if (self.hasNext() == false) {
                        self.hasMore(false);
                    } else {
                        self.hasMore(true);
                    }
                } else {
                    self.records(self.records().concat(data.Records.reverse()));
                    if (self.hasPrevious() == false) {
                        self.hasMore(false);
                    } else {
                        self.hasMore(true);
                    }
                }
            }
            self.currentPage(data.CurrentPage);
            self.pagesize(data.PageSize);
            self.totalPages(data.TotalPages);
            self.totalRecords(data.TotalRecords);
            hideLoading();
            //self.SetFavourites();
            loading = false;
        });

        if (($(window).scrollTop() + $(window).height() > $(document).height() - 425) && $("#searchInput").val().length == 0) {
            sleep(500);
            self.fetchData(false);
        }
    }

    var typingTimeout;
    self.searchChanged = function () {
        var searchQuery = $(event.target).val();

        if (searchQuery.length > 0) {
            if (typingTimeout) {
                clearTimeout(typingTimeout);
            }
            typingTimeout = setTimeout(function () {
                $.get(self.baseUri() + "/SearchByName", {
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
            self.fetchData(true);
        }
    };

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
    self.fetchData(true);
    console.log("VM initialized!");
};

function showButtons() {
    $(event.target).children(".card-action-buttons").fadeTo('fast', 1.0);
}

function hideButtons() {
    $(event.target).children(".card-action-buttons").fadeTo('fast', 0.0);
}

$(document).ready(function () {
    ko.applyBindings(new vm());
});

$(document).ajaxComplete(function (event, xhr, options) {
    $("#myModal").modal('hide');
})