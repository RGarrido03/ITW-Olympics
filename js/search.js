// ViewModel KnockOut
var vm = function () {
    console.log('ViewModel initiated...');
    //---Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/Olympics/api/Utils/Search');
    self.displayName = 'Olympic Games statistics';
    self.error = ko.observable('');
    self.AthletesRecords = ko.observableArray([]);
    self.CompetitionsRecords = ko.observableArray([]);
    self.CountriesRecords = ko.observableArray([]);
    self.GamesRecords = ko.observableArray([]);
    self.ModalitiesRecords = ko.observableArray([]);
    self.searchLoading = ko.observable(false);

    var typingTimeout;
    self.searchChanged = function () {
        var searchQuery = $(event.target).val();

        if (searchQuery.length >= 3) {
            if (typingTimeout) {
                clearTimeout(typingTimeout);
            }
            typingTimeout = setTimeout(function () {
                self.searchLoading(true);
                ajaxHelper(self.baseUri(), 'GET', { q: searchQuery }).done(function (data) {
                    console.log(data);
                    data.forEach(function (item) {
                        switch (item.TableName) {
                            case "Athletes":
                                self.AthletesRecords.push({"id": item.Id, "name": item.Name});
                                break;
                            case "Competitions":
                                self.CompetitionsRecords.push({"id": item.Id, "name": item.Name});
                                break;
                            case "Countries":
                                self.CountriesRecords.push({"id": item.Id, "name": item.Name});
                                break;
                            case "Games":
                                self.GamesRecords.push({"id": item.Id, "name": item.Name});
                                break;
                            case "Modalities":
                                self.ModalitiesRecords.push({"id": item.Id, "name": item.Name});
                                break;
                        }
                    });
                    self.searchLoading(false);
                    console.log(self.AthletesRecords());
                });
            }, 1000);
        }
        else if (searchQuery.length == 0) {
            clearTimeout(typingTimeout);
            self.searchLoading(true);
            self.AthletesRecords([]);
            self.CompetitionsRecords([]);
            self.CountriesRecords([]);
            self.GamesRecords([]);
            self.ModalitiesRecords([]);
            self.searchLoading(false);
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

    self.scrollToTop = function () {
        $('html, body').animate({ scrollTop: 0 }, 'fast');
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
}

$(document).ready(function () {
    console.log("document.ready!");
    ko.applyBindings(new vm());
});