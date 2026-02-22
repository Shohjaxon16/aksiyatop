let mainMap;
let modalMap;
let marker;
let objectManager;

function initMap() {
    ymaps.ready(() => {
        const tashkent = [41.311081, 69.240562];

        // Main Map
        const mapDiv = document.getElementById("googleMap");
        if (mapDiv) {
            mainMap = new ymaps.Map("googleMap", {
                center: tashkent,
                zoom: 12,
                controls: ['zoomControl', 'searchControl', 'typeSelector', 'fullscreenControl']
            });

            // Use ObjectManager for 10,000+ points
            objectManager = new ymaps.ObjectManager({
                clusterize: true,
                gridSize: 64,
                clusterDisableClickZoom: false
            });

            // Style clusters
            objectManager.clusters.options.set('preset', 'islands#orangeClusterIcons');
            objectManager.objects.options.set('preset', 'islands#orangeCircleDotIcon');

            mainMap.geoObjects.add(objectManager);

            // If data is already loaded in app.js
            if (window.mockDiscounts) {
                updateMapMarkers(window.mockDiscounts);
            }
        }

        // Modal Map
        const modalMapDiv = document.getElementById("modalMap");
        if (modalMapDiv) {
            modalMap = new ymaps.Map("modalMap", {
                center: tashkent,
                zoom: 14,
                controls: []
            });

            marker = new ymaps.Placemark(tashkent, {
                hintContent: 'Do\'koningiz joyini belgilang'
            }, {
                draggable: true,
                preset: 'islands#orangeDotIcon'
            });

            marker.events.add('dragend', () => {
                const coords = marker.geometry.getCoordinates();
                document.getElementById('latitude').value = coords[0];
                document.getElementById('longitude').value = coords[1];
            });

            modalMap.geoObjects.add(marker);
            document.getElementById('latitude').value = tashkent[0];
            document.getElementById('longitude').value = tashkent[1];
        }
    });
}

// Optimized function to update markers
function updateMapMarkers(data) {
    if (!objectManager) return;

    const features = data.map(item => ({
        type: 'Feature',
        id: item.id,
        geometry: {
            type: 'Point',
            coordinates: [item.lat, item.lng]
        },
        properties: {
            balloonContentHeader: item.shop,
            balloonContentBody: `${item.percent}% chegirma: ${item.product}`,
            hintContent: item.shop
        }
    }));

    objectManager.removeAll();
    objectManager.add({
        type: 'FeatureCollection',
        features: features
    });
}

// Global references
window.initMap = initMap;
window.updateMapMarkers = updateMapMarkers;
document.addEventListener('DOMContentLoaded', initMap);
