// ViewModel KnockOut
var vm = function () {
    console.log('ViewModel initiated...');
    //---Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/Olympics/api/Statistics/');
    self.displayName = 'Olympic Games statistics';
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');
    self.Games = ko.observableArray([]);
    self.Athletes = ko.observableArray([]);
    self.Competitions = ko.observableArray([]);
    self.Countries = ko.observableArray([]);
    self.Modalities = ko.observableArray([]);
    self.CountriesList = ko.observableArray([]);
    self.MedalsGold = ko.observableArray([]);
    self.MedalsSilver = ko.observableArray([]);
    self.MedalsBronze = ko.observableArray([]);

    self.fetchData = async function () {
        console.log('CALL: fetchData...');
        console.log('Calling ajaxHelper for Athletes...');
        ajaxHelper(self.baseUri() + 'Games_Athletes', 'GET').done(function (data) {
            console.log(data);
            data.forEach(function (item) {
                self.Athletes.push(item.Counter);
                self.Games.push(item.Name);
            });
            console.log('Games: ' + self.Games());
            console.log('Athletes: ' + self.Athletes());
            self.createAthletesGraph();
        });

        console.log('Calling ajaxHelper for Competitions...');
        ajaxHelper(self.baseUri() + 'Games_Competitions', 'GET').done(function (data) {
            console.log(data);
            data.forEach(function (item) {
                self.Competitions.push(item.Counter);
            });
            console.log('Competitions: ' + self.Competitions());
            self.createCompetitionsGraph();
        });

        console.log('Calling ajaxHelper for Countries...');
        ajaxHelper(self.baseUri() + 'Games_Countries', 'GET').done(function (data) {
            console.log(data);
            data.forEach(function (item) {
                self.Countries.push(item.Counter);
            });
            console.log('Countries: ' + self.Countries());
            self.createCountriesGraph();
        });

        console.log('Calling ajaxHelper for Modalities...');
        ajaxHelper(self.baseUri() + 'Games_Modalities', 'GET').done(function (data) {
            console.log(data);
            data.forEach(function (item) {
                self.Modalities.push(item.Counter);
            });
            console.log('Modalities: ' + self.Modalities());
            self.createModalitiesGraph();
        });

        console.log('Calling ajaxHelper for Medals...');
        ajaxHelper(self.baseUri() + 'Medals_Country', 'GET').done(function (data) {
            console.log(data);
            data.forEach(function (item) {
                self.CountriesList.push(item.CountryName);
                self.MedalsGold.push(item.Medals[0].Counter);
                self.MedalsSilver.push(item.Medals[1].Counter);
                self.MedalsBronze.push(item.Medals[2].Counter);
            });
            console.log('Gold Medals: ' + self.MedalsGold());
            console.log('Silver Medals: ' + self.MedalsSilver());
            console.log('Bronze Medals: ' + self.MedalsBronze());
            self.createMedalsGraph();
            hideLoading();
        });

    };

    self.createAthletesGraph = function () {
        const ctx = document.getElementById('AthletesChart');

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: self.Games(),
                datasets: [{
                    label: 'Athletes',
                    data: self.Athletes(),
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    self.createCompetitionsGraph = function () {
        const ctx = document.getElementById('CompetitionsChart');

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: self.Games(),
                datasets: [{
                    label: 'Competitions',
                    data: self.Competitions(),
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    self.createCountriesGraph = function () {
        const ctx = document.getElementById('CountriesChart');

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: self.Games(),
                datasets: [{
                    label: 'Countries',
                    data: self.Countries(),
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    self.createModalitiesGraph = function () {
        const ctx = document.getElementById('ModalitiesChart');

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: self.Games(),
                datasets: [{
                    label: 'Modalities',
                    data: self.Modalities(),
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    self.createMedalsGraph = function () {
        const ctx = document.getElementById('MedalsChart');

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: self.CountriesList(),
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
                        stacked: true
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
    self.fetchData();
};

$(document).ready(function () {
    console.log("document.ready!");
    ko.applyBindings(new vm());
});

$(document).ajaxComplete(function (event, xhr, options) {
    $("#myModal").modal('hide');
})