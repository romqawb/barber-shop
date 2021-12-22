mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: [0.1276, 51.5072], // starting position [lng, lat]
    zoom: 10 // starting zoom
});


map.addControl(new mapboxgl.NavigationControl());

const marker = new mapboxgl.Marker()
    .setLngLat([0.1276, 51.5072])
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h5>London Barber Shop<h5>`
            )
    )
    .addTo(map)

console.log('from map script')