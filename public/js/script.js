const socket = io()

console.log("script.k")


if(navigator.geolocation){
    navigator.geolocation.watchPosition(
    (position) => {
        const {latitude , longitude } = position.coords;
        socket.emit("send-location" , { latitude  , longitude})
    },
    (error) => {
        console.log(error)
    },
    {
        enableHighAccuracy : true,
        timeout : 5000,
        maximumAge : 0,
    }
)
}
const map = L.map("map").setView([0 ,0], 10)

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" , {
    attribution : "DHA phase 6"
}).addTo(map)


const markers = {}

socket.on("receive-location" , (data)=> {
    const {id , longitude , latitude} = data
    map.setView([latitude , longitude] , 16)
    if(markers[id]){
        markers[id].setLatLng([latitude , longitude])
    }else{
        markers[id] = L.marker([latitude , longitude]).addTo(map)
    }
})

socket.on("user-disconnected" , (id) => {
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id]
    }
})