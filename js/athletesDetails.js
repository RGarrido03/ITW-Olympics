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
    self.Id = ko.observable('');
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

    //--- Page Events
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
        });
    };

    self.getMoreData = async function () {
        console.log("Getting full details of game with ID " + self.Id());
        showLoading();
        var composedUri = self.baseUri() + "/FullDetails?id=" + id;
        await ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            self.Summary(false);
            self.Games(data.Games);
            self.Modalities(data.Modalities);
            self.Competitions(data.Competitions);
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