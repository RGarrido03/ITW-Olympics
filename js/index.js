// ViewModel KnockOut
var vm = function () {
    console.log('ViewModel initiated...');
    //---Variáveis locais
    var self = this;
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');

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
    
    self.addMarkers = async function () {
        console.log("Entering addMarkers()...");
        var mcgLayerSupportGroup = L.markerClusterGroup.layerSupport();
        console.log("mcgLayerSupportGroup: " + mcgLayerSupportGroup)
        mcgLayerSupportGroup.addTo(map);
        console.log("mcgLayerSupportGroup added to map: " + mcgLayerSupportGroup)

        var summer = L.layerGroup().addTo(map);
        var winter = L.layerGroup().addTo(map);
        await ajaxHelper("http://192.168.160.58/Olympics/api/games?page=1&pageSize=100", 'GET').done(function (data) {
            console.log(data);
            data.Records.forEach(function (record) {
                var marker = L.marker([record.Lat, record.Lon], {alt: record.Name}).addTo(map);
                marker.bindPopup("<b>" + record.Name + "</b><br>" + record.CityName);
                if (record.Name.includes('Summer')) {
                    summer.addLayer(marker);
                } else {
                    winter.addLayer(marker);
                }
            });
        })
        mcgLayerSupportGroup.checkIn(summer);
        mcgLayerSupportGroup.checkIn(winter);
        summer.addTo(map);
        winter.addTo(map);
        
        var overlay = {'Summer': summer, 'Winter': winter};
        L.control.layers(null, overlay).addTo(map);
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
            }
        });
    }

    
    var map = L.map('map', {zoomSnap: 0.25}).setView([28,0], 1.5);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    
    self.addMarkers();
    console.log("VM initialized!");
};

$(document).ready(function () {
    ko.applyBindings(new vm());
});