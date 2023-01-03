// ViewModel KnockOut
var vm = function () {
    console.log('ViewModel initiated...');
    //---Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/Olympics/api/countries/');
    self.displayName = 'Olympic Countries edition Details';
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');

    self.createGraph = function () {
        const ctx = document.getElementById('MedalsPerCountryChart');

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: self.MedalsGames(),
                datasets: [{
                    label: 'Gold',
                    data: self.MedalsGold(),
                    borderWidth: 1
                },
                {
                    label: 'Silver',
                    data: self.MedalsSilver(),
                    borderWidth: 1
                },
                {
                    label: 'Bronze',
                    data: self.MedalsBronze(),
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        stacked: true,
                    },
                    x: {
                        stacked: true
                    }
                }
            }
        });
    }

    self.scrollToTop = function () {
        $('html, body').animate({ scrollTop: 0 }, 'fast');
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

    //--- start ....
    showLoading();
};

$(document).ready(function () {
    console.log("document.ready!");
    ko.applyBindings(new vm());
});

$(document).ajaxComplete(function (event, xhr, options) {
    $("#myModal").modal('hide');
})