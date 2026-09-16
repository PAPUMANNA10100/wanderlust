const mapElement = document.getElementById("map");

if (mapElement) {
    const mapToken = mapElement.dataset.token;
    let coordinates = [77.2090, 28.6139]; 
    
    try {
        if (mapElement.dataset.coordinates) {
            const parsed = JSON.parse(mapElement.dataset.coordinates);
            if (Array.isArray(parsed) && parsed.length === 2 && !isNaN(parsed[0]) && !isNaN(parsed[1])) {
                coordinates = parsed;
            }
        }
    } catch (e) {
        console.warn("Could not parse coordinates, using fallback:", e);
    }

    const listingLocation = mapElement.dataset.location || "Exact location";

    if (mapToken && typeof mapboxgl !== "undefined") {
        mapboxgl.accessToken = mapToken;

        const map = new mapboxgl.Map({
            container: "map",
            style: "mapbox://styles/mapbox/streets-v12",
            center: coordinates,
            zoom: 9,
        });

        map.addControl(new mapboxgl.NavigationControl(), "top-right");

        new mapboxgl.Marker({ color: "#fe424d" })
            .setLngLat(coordinates)
            .setPopup(
                new mapboxgl.Popup({ offset: 25 })
                    .setHTML(
                        `<h6 style="margin:0 0 5px; font-weight:700;">${listingLocation}</h6><p style="margin:0; font-size:12px; color:#666;">Exact location will be provided after booking</p>`
                    )
                    .setMaxWidth("300px")
            )
            .addTo(map);
    }
}