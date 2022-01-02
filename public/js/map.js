mapboxgl.accessToken = mapToken;
const parsedData = JSON.parse(data);
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
    center: parsedData.geometry.coordinates,
    zoom: 14
});

map.addControl(new mapboxgl.NavigationControl());

const marker = new mapboxgl.Marker()
    .setLngLat(parsedData.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h5>${parsedData.name}<h5>`
            )
    )
    .addTo(map)

