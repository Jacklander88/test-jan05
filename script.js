// Initialize Map
let map;
let userMarker;
let markers = [];
let users = [];
let routes = [];
let zones = [];
let measurements = [];

// Initialize Leaflet Map
function initMap() {
    map = L.map('map').setView([54.3926, 18.6463], 9); // Gdańsk

    // Add Tile Layer (Roads)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add Satellite Layer (optional)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
    }).addTo(map);

    // Add User Marker
    userMarker = L.marker([54.3926, 18.6463], {
        icon: L.divIcon({
            className: 'leaflet-user-marker',
            html: '👤',
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        })
    }).addTo(map);

    // Add Sample Markers (from your screenshot)
    addSampleMarkers();

    // Add Control for Map View
    const satelliteLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
    });

    const roadLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
    });

    const satelliteButton = document.getElementById('satellite-btn');
    const roadButton = document.getElementById('road-btn');

    satelliteButton.addEventListener('click', function() {
        map.removeLayer(roadLayer);
        map.addLayer(satelliteLayer);
        map.setView([54.3926, 18.6463], 9);
    });

    roadButton.addEventListener('click', function() {
        map.removeLayer(satelliteLayer);
        map.addLayer(roadLayer);
        map.setView([54.3926, 18.6463], 9);
    });

    // Add Search Bar
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', function(e) {
        const query = e.target.value.toLowerCase();
        if (query === '') {
            map.eachLayer(function(layer) {
                if (layer instanceof L.Marker) {
                    layer.setStyle({ opacity: 1 });
                }
            });
            return;
        }

        map.eachLayer(function(layer) {
            if (layer instanceof L.Marker) {
                const markerName = layer.options.title || '';
                if (markerName.toLowerCase().includes(query)) {
                    layer.setStyle({ opacity: 1 });
                } else {
                    layer.setStyle({ opacity: 0.3 });
                }
            }
        });
    });

    // Add Add Marker Function
    document.getElementById('add-marker-btn').addEventListener('click', function() {
        const lat = prompt('Enter Latitude:');
        const lng = prompt('Enter Longitude:');
        const name = prompt('Enter Marker Name:');
        const type = prompt('Enter Marker Type (e.g., Measurement, Route, Zone):', 'Measurement');

        if (lat && lng && name && type) {
            const marker = L.marker([parseFloat(lat), parseFloat(lng)], {
                title: name,
                icon: L.divIcon({
                    className: `leaflet-${type.toLowerCase()}-marker`,
                    html: type.charAt(0).toUpperCase() + type.slice(1),
                    iconSize: [20, 20],
                    iconAnchor: [10, 10]
                })
            });

            marker.addTo(map);
            markers.push(marker);
            updateLocalStorage();
            alert('Marker added!');
        } else {
            alert('Invalid input!');
        }
    });

    // Add Share Marker Function
    document.getElementById('share-marker-btn').addEventListener('click', function() {
        alert('Marker shared with team (simulated)!'); // Simulated
    });

    // Add Export Function
    document.getElementById('export-btn').addEventListener('click', function() {
        alert('Map exported as PNG (simulated)!'); // Simulated
    });

    // Add Sync Function
    document.getElementById('sync-btn').addEventListener('click', function() {
        alert('Synced with team (simulated)!'); // Simulated
    });

    // Add Settings Function
    document.getElementById('settings-btn').addEventListener('click', function() {
        alert('Settings opened (simulated)!'); // Simulated
    });

    // Add Show Users Function
    document.getElementById('show-users-btn').addEventListener('click', function() {
        users.forEach(user => {
            if (user !== userMarker) {
                user.setOpacity(1);
            }
        });
    });

    // Add Show Markers Function
    document.getElementById('show-markers-btn').addEventListener('click', function() {
        markers.forEach(marker => {
            marker.setOpacity(1);
        });
    });

    // Add Show Routes Function
    document.getElementById('show-routes-btn').addEventListener('click', function() {
        routes.forEach(route => {
            route.setOpacity(1);
        });
    });

    // Add Marker Info Popup
    map.on('click', function(e) {
        const clickedMarker = e.layer;
        if (clickedMarker && clickedMarker.options.title) {
            document.getElementById('marker-name').textContent = clickedMarker.options.title;
            document.getElementById('marker-type').textContent = clickedMarker.options.icon.options.html;
            document.getElementById('marker-time').textContent = '2025-01-01 12:00'; // Simulated
            document.getElementById('marker-modal').style.display = 'flex';
        }
    });

    document.getElementById('close-modal-btn').addEventListener('click', function() {
        document.getElementById('marker-modal').style.display = 'none';
    });

    // Add Sample Markers (based on your screenshot)
    function addSampleMarkers() {
        const sampleMarkers = [
            { lat: 54.4012, lng: 18.6394, name: "Sensor #1", type: "Measurement", icon: "M" },
            { lat: 54.3987, lng: 18.6423, name: "SANTA 01", type: "Zone", icon: "Z" },
            { lat: 54.3962, lng: 18.6441, name: "Measurement 23", type: "Measurement", icon: "M" },
            { lat: 54.3938, lng: 18.6459, name: "Route 28", type: "Route", icon: "R" },
            { lat: 54.3914, lng: 18.6477, name: "AFR6201", type: "Zone", icon: "Z" },
            { lat: 54.3890, lng: 18.6495, name: "Measurement 24", type: "Measurement", icon: "M" },
            { lat: 54.3866, lng: 18.6513, name: "Measurement 25", type: "Measurement", icon: "M" },
            { lat: 54.3842, lng: 18.6531, name: "Measurement 26", type: "Measurement", icon: "M" },
            { lat: 54.3818, lng: 18.6549, name: "Measurement 27", type: "Measurement", icon: "M" },
            { lat: 54.3794, lng: 18.6567, name: "Measurement 28", type: "Measurement", icon: "M" },
            { lat: 54.3770, lng: 18.6585, name: "Measurement 29", type: "Measurement", icon: "M" },
            { lat: 54.3746, lng: 18.6603, name: "Measurement 30", type: "Measurement", icon: "M" },
            { lat: 54.3722, lng: 18.6621, name: "Measurement 31", type: "Measurement", icon: "M" },
            { lat: 54.3698, lng: 18.6639, name: "Measurement 32", type: "Measurement", icon: "M" },
            { lat: 54.3674, lng: 18.6657, name: "Measurement 33", type: "Measurement", icon: "M" },
            { lat: 54.3650, lng: 18.6675, name: "Measurement 34", type: "Measurement", icon: "M" },
            { lat: 54.3626, lng: 18.6693, name: "Measurement 35", type: "Measurement", icon: "M" },
            { lat: 54.3602, lng: 18.6711, name: "Measurement 36", type: "Measurement", icon: "M" },
            { lat: 54.3578, lng: 18.6729, name: "Measurement 37", type: "Measurement", icon: "M" },
            { lat: 54.3554, lng: 18.6747, name: "Measurement 38", type: "Measurement", icon: "M" },
            { lat: 54.3530, lng: 18.6765, name: "Measurement 39", type: "Measurement", icon: "M" },
            { lat: 54.3506, lng: 18.6783, name: "Measurement 40", type: "Measurement", icon: "M" },
            { lat: 54.3482, lng: 18.6801, name: "Measurement 41", type: "Measurement", icon: "M" },
            { lat: 54.3458, lng: 18.6819, name: "Measurement 42", type: "Measurement", icon: "M" },
            { lat: 54.3434, lng: 18.6837, name: "Measurement 43", type: "Measurement", icon: "M" },
            { lat: 54.3410, lng: 18.6855, name: "Measurement 44", type: "Measurement", icon: "M" },
            { lat: 54.3386, lng: 18.6873, name: "Measurement 45", type: "Measurement", icon: "M" },
            { lat: 54.3362, lng: 18.6891, name: "Measurement 46", type: "Measurement", icon: "M" },
            { lat: 54.3338, lng: 18.6909, name: "Measurement 47", type: "Measurement", icon: "M" },
            { lat: 54.3314, lng: 18.6927, name: "Measurement 48", type: "Measurement", icon: "M" },
            { lat: 54.3290, lng: 18.6945, name: "Measurement 49", type: "Measurement", icon: "M" },
            { lat: 54.3266, lng: 18.6963, name: "Measurement 50", type: "Measurement", icon: "M" },
            { lat: 54.3242, lng: 18.6981, name: "Measurement 51", type: "Measurement", icon: "M" },
            { lat: 54.3218, lng: 18.7000, name: "Measurement 52", type: "Measurement", icon: "M" },
            { lat: 54.3194, lng: 18.7018, name: "Measurement 53", type: "Measurement", icon: "M" },
            { lat: 54.3170, lng: 18.7036, name: "Measurement 54", type: "Measurement", icon: "M" },
            { lat: 54.3146, lng: 18.7054, name: "Measurement 55", type: "Measurement", icon: "M" },
            { lat: 54.3122, lng: 18.7072, name: "Measurement 56", type: "Measurement", icon: "M" },
            { lat: 54.3098, lng: 18.7090, name: "Measurement 57", type: "Measurement", icon: "M" },
            { lat: 54.3074, lng: 18.7108, name: "Measurement 58", type: "Measurement", icon: "M" },
            { lat: 54.3050, lng: 18.7126, name: "Measurement 59", type: "Measurement", icon: "M" },
            { lat: 54.3026, lng: 18.7144, name: "Measurement 60", type: "Measurement", icon: "M" },
            { lat: 54.3002, lng: 18.7162, name: "Measurement 61", type: "Measurement", icon: "M" },
            { lat: 54.2978, lng: 18.7180, name: "Measurement 62", type: "Measurement", icon: "M" },
            { lat: 54.2954, lng: 18.7198, name: "Measurement 63", type: "Measurement", icon: "M" },
            { lat: 54.2930, lng: 18.7216, name: "Measurement 64", type: "Measurement", icon: "M" },
            { lat: 54.2906, lng: 18.7234, name: "Measurement 65", type: "Measurement", icon: "M" },
            { lat: 54.2882, lng: 18.7252, name: "Measurement 66", type: "Measurement", icon: "M" },
            { lat: 54.2858, lng: 18.7270, name: "Measurement 67", type: "Measurement", icon: "M" },
            { lat: 54.2834, lng: 18.7288, name: "Measurement 68", type: "Measurement", icon: "M" },
            { lat: 54.2810, lng: 18.7306, name: "Measurement 69", type: "Measurement", icon: "M" },
            { lat: 54.2786, lng: 18.7324, name: "Measurement 70", type: "Measurement", icon: "M" },
            { lat: 54.2762, lng: 18.7342, name: "Measurement 71", type: "Measurement", icon: "M" },
            { lat: 54.2738, lng: 18.7360, name: "Measurement 72", type: "Measurement", icon: "M" },
            { lat: 54.2714, lng: 18.7378, name: "Measurement 73", type: "Measurement", icon: "M" },
            { lat: 54.2690, lng: 18.7396, name: "Measurement 74", type: "Measurement", icon: "M" },
            { lat: 54.2666, lng: 18.7414, name: "Measurement 75", type: "Measurement", icon: "M" },
            { lat: 54.2642, lng: 18.7432, name: "Measurement 76", type: "Measurement", icon: "M" },
            { lat: 54.2618, lng: 18.7450, name: "Measurement 77", type: "Measurement", icon: "M" },
            { lat: 54.2594, lng: 18.7468, name: "Measurement 78", type: "Measurement", icon: "M" },
            { lat: 54.2570, lng: 18.7486, name: "Measurement 79", type: "Measurement", icon: "M" },
            { lat: 54.2546, lng: 18.7504, name: "Measurement 80", type: "Measurement", icon: "M" },
            { lat: 54.2522, lng: 18.7522, name: "Measurement 81", type: "Measurement", icon: "M" },
            { lat: 54.2498, lng: 18.7540, name: "Measurement 82", type: "Measurement", icon: "M" },
            { lat: 54.2474, lng: 18.7558, name: "Measurement 83", type: "Measurement", icon: "M" },
            { lat: 54.2450, lng: 18.7576, name: "Measurement 84", type: "Measurement", icon: "M" },
            { lat: 54.2426, lng: 18.7594, name: "Measurement 85", type: "Measurement", icon: "M" },
            { lat: 54.2402, lng: 18.7612, name: "Measurement 86", type: "Measurement", icon: "M" },
            { lat: 54.2378, lng: 18.7630, name: "Measurement 87", type: "Measurement", icon: "M" },
            { lat: 54.2354, lng: 18.7648, name: "Measurement 88", type: "Measurement", icon: "M" },
            { lat: 54.2330, lng: 18.7666, name: "Measurement 89", type: "Measurement", icon: "M" },
            { lat: 54.2306, lng: 18.7684, name: "Measurement 90", type: "Measurement", icon: "M" },
            { lat: 54.2282, lng: 18.7702, name: "Measurement 91", type: "Measurement", icon: "M" },
            { lat: 54.2258, lng: 18.7720, name: "Measurement 92", type: "Measurement", icon: "M" },
            { lat: 54.2234, lng: 18.7738, name: "Measurement 93", type: "Measurement", icon: "M" },
            { lat: 54.2210, lng: 18.7756, name: "Measurement 94", type: "Measurement", icon: "M" },
            { lat: 54.2186, lng: 18.7774, name: "Measurement 95", type: "Measurement", icon: "M" },
            { lat: 54.2162, lng: 18.7792, name: "Measurement 96", type: "Measurement", icon: "M" },
            { lat: 54.2138, lng: 18.7810, name: "Measurement 97", type: "Measurement", icon: "M" },
            { lat: 54.2114, lng: 18.7828, name: "Measurement 98", type: "Measurement", icon: "M" },
            { lat: 54.2090, lng: 18.7846, name: "Measurement 99", type: "Measurement", icon: "M" },
            { lat: 54.2066, lng: 18.7864, name: "Measurement 100", type: "Measurement", icon: "M" },
        ];

        sampleMarkers.forEach(markerData => {
            const marker = L.marker([markerData.lat, markerData.lng], {
                title: markerData.name,
                icon: L.divIcon({
                    className: `leaflet-${markerData.type.toLowerCase()}-marker`,
                    html: markerData.icon,
                    iconSize: [20, 20],
                    iconAnchor: [10, 10]
                })
            });

            marker.addTo(map);
            markers.push(marker);
        });
    }

    // Update Local Storage
    function updateLocalStorage() {
        localStorage.setItem('markers', JSON.stringify(markers));
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('routes', JSON.stringify(routes));
        localStorage.setItem('zones', JSON.stringify(zones));
        localStorage.setItem('measurements', JSON.stringify(measurements));
    }

    // Load Local Storage
    function loadLocalStorage() {
        const savedMarkers = localStorage.getItem('markers');
        if (savedMarkers) {
            markers = JSON.parse(savedMarkers);
            markers.forEach(marker => {
                map.addLayer(marker);
            });
        }
    }

    // Initialize
    initMap();
    loadLocalStorage();
}

// Run on Load
window.onload = function() {
    initMap();
};
