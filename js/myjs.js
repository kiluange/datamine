$(document).ready(function () {

    var mymap = L.map('mapid').setView([-12.97, -56.51], 5);
    var layerMarkers = undefined;


    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 15,
        id: 'mapbox.streets',
        accessToken: 'your.mapbox.access.token'
    }).addTo(mymap);

    $.get("../estados.json").then(resp => {
        resp.sort(function(a, b) {
            return a.Estados.localeCompare(b.Estados);
        })   
        resp.map(e => {
            var o = new Option(e.Estados, e.Estados);
            /// jquerify the DOM object 'o' so we can use the html method
            $(o).html(e.Estados);
            $("#uf").append(o);
        });
    });

    $("#uf").change(function () {
        var b = 0;
        var m = 0;
        var r = 0;
        var estado = $("#uf").val();
        $.get("../linkage.json").then(resp => {
            var ba = resp.filter(function (resp) {
                return resp.uf == estado;
            });


            ba.map(function (e) {
                var good = L.icon({
                    iconUrl: '../img/good.png',
                    iconSize: [32, 32],
                    iconAnchor: [17, 33]
                });
                var average = L.icon({
                    iconUrl: '../img/average.png',
                    iconSize: [32, 32],
                    iconAnchor: [17, 32]
                });
                var bad = L.icon({
                    iconUrl: '../img/bad.png',
                    iconSize: [32, 32],
                    iconAnchor: [17, 32]
                });

                var markers = [];

                if (e.dsc_adap_defic_fisic_idosos == 'DESEMPENHO MUITO ACIMA DA MEDIA') {
                    b += 1;
                    markers.push(L.marker([e.lat, e.long], {
                        icon: good,
                        title: e.no_fantasia,
                    }).bindPopup(
                        `<h1>${e.no_fantasia}</h1>
                        <h3>${e.ds_tipo_unidade}</h3>
                        <p>ENDEREÇO: ${e.no_logradouro} Nº ${e.nu_endereco} - ${e.no_bairro} - ${e.municipio} - ${e.uf}, CEP: ${e.co_cep}</p>
                        <p>CÓDIGO MUNICÍPIO: ${e.co_munic}</p>
                        <p>CÓDIGO CNES: ${e.co_cnes}</p>
                        <p>CÓDIGO IBGE: ${e.co_ibge}</p>`).openPopup());
                } else if (e.dsc_adap_defic_fisic_idosos == 'DESEMPENHO ACIMA DA MEDIA') {
                    m += 1;
                    markers.push(
                        L.marker([e.lat, e.long], {
                            icon: average,
                            title: e.no_fantasia,
                        }).bindPopup(
                            `<h1>${e.no_fantasia}</h1>
                        <h3>${e.ds_tipo_unidade}</h3>
                        <p>ENDEREÇO: ${e.no_logradouro} Nº ${e.nu_endereco} - ${e.no_bairro} - ${e.municipio} - ${e.uf}, CEP: ${e.co_cep}</p>
                        <p>CÓDIGO MUNICÍPIO: ${e.co_munic}</p>
                        <p>CÓDIGO CNES: ${e.co_cnes}</p>
                        <p>CÓDIGO IBGE: ${e.co_ibge}</p>`).openPopup());
                } else if (e.dsc_adap_defic_fisic_idosos == 'DESEMPENHO MEDIANO OU  UM POUCO ABAIXO DA MEDIA') {
                    r += 1;
                    markers.push(L.marker([e.lat, e.long], {
                        icon: bad,
                        title: e.no_fantasia,
                    }).bindPopup(
                        `<h1>${e.no_fantasia}</h1>
                        <h3>${e.ds_tipo_unidade}</h3>
                        <p>ENDEREÇO: ${e.no_logradouro} Nº ${e.nu_endereco} - ${e.no_bairro} - ${e.municipio} - ${e.uf}, CEP: ${e.co_cep}</p>
                        <p>CÓDIGO MUNICÍPIO: ${e.co_munic}</p>
                        <p>CÓDIGO CNES: ${e.co_cnes}</p>
                        <p>CÓDIGO IBGE: ${e.co_ibge}</p>`).openPopup());
                }

                layerMarkers = L.featureGroup(markers).addTo(mymap);
            });
        });
        google.charts.load('current', {
            'packages': ['corechart']
        });
        google.charts.setOnLoadCallback(drawChart);

        function drawChart() {

            var data = google.visualization.arrayToDataTable([
                ['Task', 'Quantidade'],
                ['Bom', b],
                ['Médio', m],
                ['Ruim', r]
            ]);

            var options = {
                title: 'Capacidade de atendimento para pessoas idosas e ou com deficiência física',
                backgroundColor: 'transparent',
                colors: ['blue', 'yellow', 'red']
            };

            var chart = new google.visualization.PieChart(document.getElementById('piechart'));

            chart.draw(data, options);
        }
    });
});