const mapElement = document.getElementById("map");

const mapToken = mapElement.dataset.token;
const coordinates = JSON.parse(mapElement.dataset.coordinates);
const listingLocation = mapElement.dataset.location;

mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/standard",
    center: coordinates,
    zoom: 9,
});

new mapboxgl.Marker({ color: "green" })
    .setLngLat(coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h2>${listingLocation}</h2><p>Exact location provided after booking!</p>`
            )
            .setMaxWidth("300px")
    )
    .addTo(map);