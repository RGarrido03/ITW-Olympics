// ViewModel KnockOut
var vm = function () {
    console.log('ViewModel initiated...');
    //---Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/Olympics/api/countries');
    self.displayName = 'Olympic Countries List';
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');
    self.records = ko.observableArray([]);
    self.currentPage = ko.observable(1);
    self.pagesize = ko.observable(20);
    self.totalRecords = ko.observable(50);
    self.hasPrevious = ko.observable(false);
    self.hasNext = ko.observable(false);
    self.totalPages = ko.observable(0);
    self.order = ko.observable(0);
    self.count = ko.observable(1);
    self.hasMore = ko.observable(true);
    self.searchLoading = ko.observable(false);

    //--- Page Events
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
            self.fetchData(false);
        }
    }

    var typingTimeout;
    self.searchChanged = function () {
        var searchQuery = $(event.target).val();

        if (searchQuery.length >= 3) {
            if (typingTimeout) {
                clearTimeout(typingTimeout);
            }
            typingTimeout = setTimeout(function () {
                self.searchLoading(true);
                self.hasMore(false);
                ajaxHelper(self.baseUri() + "/SearchByName", 'GET', { q: searchQuery }).done(function (data) {
                    console.log(data);
                    if (self.order() == 0) {
                        self.records(data);
                    } else {
                        self.records(data.reverse());
                    }
                    self.searchLoading(false);
                });
            }, 1000);
        }
        else if (searchQuery.length == 0) {
            self.searchLoading(true);
            clearTimeout(typingTimeout);
            self.fetchData(true);
            self.searchLoading(false);
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
    console.log("VM initialized!");
};

$(document).ready(function () {
    ko.applyBindings(new vm());
});

$(document).ajaxComplete(function (event, xhr, options) {
    $("#myModal").modal('hide');
})