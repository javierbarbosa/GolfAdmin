      // $(document).ready(function(){

      // });

var map;
var lineaAlGreen;
var linea = { path: 'M 0,-1 0,1', strokeOpacity: 1, scale: 2 };
var labels = ['','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31'];
var indice = 0;
var coordenadas = [];
var coordenadasAlGreen = [];
var ubicacionGreen = "";

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -32.866613, lng: -68.759538},// en el centro del recorrido del hoyo en juego
        zoom: 20,
        mapTypeId: 'satellite'          
     });

    marcaGreen();     

    google.maps.event.addListener(map, 'click', function(event) {
        if (navigator.geolocation) {          
          navigator.geolocation.getCurrentPosition(gpsActivado, gpsDesactivado)
        } else {
          // Browser doesn't support Geolocation          
          navigator.notification.alert(
              'El browser no soporta geolocalizacion!!!',  // message
              alertDismissed,         // callback
              'Error',            // title
              'Cerrar'                  // buttonName
          );
        }


        //esto puedo usarlo con otra funcion en el futuro
        //agregarCoordenada(event.latLng.lat(), event.latLng.lng());
        //agregarMarcador(event.latLng);        
        //if(indice>1) 
        //    dibujarRecorrido();
    });
};

function gpsActivado(posicion){
            lat=posicion.coords.latitude;
            lng=posicion.coords.longitude;
            agregarCoordenada(lat, lng );
            agregarMarcador(new google.maps.LatLng(lat, lng));        
            
            if(indice>1) 
              dibujarRecorrido();
            //var pos = { lat: position.coords.latitude, lng: position.coords.longitude};            
            //infoWindow.setPosition(pos);
            //infoWindow.setContent('Location found.');
            //map.setCenter(pos);
            
}

function gpsDesactivado(error) {
    alert(error.message);
    navigator.notification.alert(
              error.message,  // message
              alertDismissed,     // callback
              'Aviso',            // title
              'Cerrar'            // buttonName
    );        
}

function alertDismissed() {
    // do something
}

function marcaGreen(){    
    lat=-32.8667;    
    lng=-68.761100008;
    agregarCoordenadaAlGreen(lat, lng);// green... a la posición 0    
    ubicacionGreen = new google.maps.LatLng(lat, lng);    
    icono = "img/hoyo.png";
    var marcador = new google.maps.Marker({
          position: ubicacionGreen, map: map, icon: icono          
    });                    
}

function agregarMarcador(ubicacion) {
    var icono = "";
    var contenido = "";    
    switch(indice) {
        case 0:
                agregarCoordenadaAlGreen(ubicacion.lat(), ubicacion.lng());
                icono = "img/tee.png";                    
                var distancia = calcularDistanciaAlGreen();
                contenido="Distancia al green: <b>" + dosDecimales(distancia.toString()) + " mts </b>";
                dibujarLineaAlGreen();
                break;
        default:                
                icono = "img/golpe.png";
                lineaAlGreen.setMap(null);
                contenido="Distancia ultimo golpe: <b>"+dosDecimales(calcularDistancia()).toString() + " mts </b>";
                var ultimo = coordenadasAlGreen.pop();//elimina la última
                agregarCoordenadaAlGreen(ubicacion.lat(), ubicacion.lng());
                dibujarLineaAlGreen();
                var distancia = dosDecimales(calcularDistanciaAlGreen()).toString();
                contenido = contenido + "<br> Distancia al green: <b>" + distancia + " mts </b>";
    }   

    var marcador = new google.maps.Marker({
          position: ubicacion,
          label: labels[indice++ % labels.length],
          map: map,
          icon: icono,          
          title: contenido
    });

    var infowindow = new google.maps.InfoWindow()

    google.maps.event.addListener(marcador,'click', (function(marcador,contenido,infowindow){ 
        return function() {
           infowindow.setContent(contenido);
           infowindow.open(map,marcador);
        };
    })(marcador,contenido,infowindow)); 

}

function dibujarRecorrido(){    
    var lineaEntrePuntos = new google.maps.Polyline({
        path: coordenadas, geodesic: true, strokeColor: '#FF0000', strokeOpacity: 0, icons: [{ icon: linea, offset: '0', repeat: '10px'}], map: map
    });
}

function dibujarLineaAlGreen(){
    lineaAlGreen = new google.maps.Polyline({
        path: coordenadasAlGreen, geodesic: true, strokeColor: '#FFFFFF', strokeOpacity: 0, icons: [{ icon: linea, offset: '0', repeat: '10px'}], map: map   
    });
}

function agregarCoordenada(lat, lng) {
    coordenadas.push(new coordenada(lat, lng));
}

function coordenada(lat, lng) {
  this.lat = lat;
  this.lng = lng; 
}

function agregarCoordenadaAlGreen(lat, lng) {
    coordenadasAlGreen.push(new coordenadaAlGreen(lat, lng));
}

function coordenadaAlGreen(lat, lng) {
  this.lat = lat;
  this.lng = lng; 
}

function calcularDistancia(){
    lat=coordenadas[indice].lat;    lng=coordenadas[indice].lng;    A=new google.maps.LatLng(lat, lng);    
    lat=coordenadas[indice-1].lat;  lng=coordenadas[indice-1].lng;  B=new google.maps.LatLng(lat, lng);
    return google.maps.geometry.spherical.computeDistanceBetween(A,B);
}

function calcularDistanciaAlGreen(){    
    lat=coordenadasAlGreen[1].lat;  lng=coordenadasAlGreen[1].lng;  ubicacion=new google.maps.LatLng(lat, lng);
    return google.maps.geometry.spherical.computeDistanceBetween(ubicacionGreen,ubicacion);    
}

function dosDecimales(n) {
  let t=n.toString();
  let regex=/(\d*.\d{0,2})/;
  return t.match(regex)[0];
}

// Initialize app  ,
var myApp = new Framework7();


// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true
});

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    console.log("Device is ready!");

    // if (navigator.geolocation) {
    //         console.log("geolocation");
    //           navigator.geolocation.getCurrentPosition(function(position) {
    //             var pos = { lat: position.coords.latitude, lng: position.coords.longitude};            
    //             alert(position.coords.latitude);
    //           }, function() {            
    //             alert("no");
    //             console.log("no funca");
    //           });
    // } else {
    //             console.log("Browser doesn't support Geolocation");
    //             alert("no broeu");
    // }

});


// Now we need to run the code that will be executed only for About page.

// Option 1. Using page callback for page (for "about" page in this case) (recommended way):
myApp.onPageInit('about', function (page) {
    // Do something here for "about" page

})

// Option 2. Using one 'pageInit' event handler for all pages:
$$(document).on('pageInit', function (e) {
    // Get page data from event data
    var page = e.detail.page;

    if (page.name === 'about') {
        // Following code will be executed for page with data-page attribute equal to "about"
        myApp.alert('Here comes About page');
    }
})

// Option 2. Using live 'pageInit' event handlers for each page
$$(document).on('pageInit', '.page[data-page="about"]', function (e) {
    // Following code will be executed for page with data-page attribute equal to "about"
    myApp.alert('Here comes About page');
})