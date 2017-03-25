# Microservicio de Interfaz de Usuario

Este microservicio será el responsable de mostrar las métricas almacenadas en el almacenamiento
persistente. Para ello, la interfaz de usuario se ha escrito en HTML5, CSS3 y Javascript del lado del
cliente.

Para consultar los datos relativos a las métricas almacenadas, este microservicio no utiliza el
microservicio de datos, sino que siempre pide estos datos a través del microservicio del API, utilizando
los *endpoints* de lectura expuestos por éste, representados por dos recursos de acceso a las métricas:
el primero recuperando todas las existentes, y el segundo recuperando todas las métricas asociadas a
un sensor. Por tanto se podrá desarrollar una aplicación en la tecnología deseada que permita el
consumo de los datos expuestos por el API REST utilizando los verbos HTTP adecuados.

## Estructura del proyecto

El microservicio de interfaz de usuario contiene únicamente un descriptor, propio de **WeDeploy**, en
formato JSON. El descriptor viene definido por el fichero `container.json` que especifica a la
plataforma **WeDeploy** que el servicio actual es del tipo `hosting`, así como le asigna un identificador
único, en este caso `ui`.

```json
{
	"id": "ui",
	"type": "wedeploy/hosting"
}
```

Para consultar el descriptor del servicio de hosting de **WeDeploy**, por favor seguir [este enlace](./container.json).

En cuanto al resto de ficheros estáticos, tanto HTML, como CSS y JS, se organizan de la siguiente manera:

### Directorio _error

**WeDeploy** define un convenio de nombres para tratar los mensaje de error de HTTP, de modo que a
cada código de error HTTP (404, 500, etc.) le corresponde un documento HTML cuyo nombre coincide con
el código de error, por ejemplo `404.html`. Estos ficheros se encuentran bajo el directorio `_errors`.

### Hojas de estilo

Las hojas de estilo CSS se encuentran bajo el directorio `css`. En ellas se encuentran los estilos
para definir la apariencia del interfaz de usuario. Se basan en dos ficheros:

* marble.css: fichero CSS obtenido directamente de **WeDeploy** ([https://github.com/wedeploy/marble/blob/master/build/marble.css](https://github.com/wedeploy/marble/blob/master/build/marble.css)).
* ui.css: customizaciones específicas para el interfaz de usuario de la plataforma.

### Scripts de Javascript

Los ficheros de script de Javascript se encuentran bajo el directorio `js`. Será en estos ficheros
donde se escriba la lógica del código a ejecutar en el cliente (navegador). En este caso, existe un
único fichero Javascript, `sensors.js`, que será el responsable del código del lado del cliente,
ejecutado en un navegador.

Este fichero contendrá funciones que o bien invocan los otros servicios en **WeDeploy**, o bien son
de utilidad para generar etiquetas HTML que representen la interfaz de usuario, o bien funciones
relacionadas con la representación en un mapa de Google Maps.

El siguiente bloque de código representa la función de invocación del servicio de comunicación con la
plataforma. Como la respuesta es del tipo JSON, se almacenará en un array de objetos JSON de Javascript
para que pueda ser procesada por la aplicación. Como puede observarse, utiliza el método `fetch`,
nativo de Javascript, para invocar el servicio remoto del API. Esta función necesita de un `callback`
para procesar de manera **asíncrona** la respuesta. En este `callback` se verifica que el resultado
ha retornado una respuesta HTTP correcta, con código de estado 200. De lo contrario, se retorna un
array vacío de objetos. Esta comprobación es necesaria puesto que el API retorna un error HTTP 404 en
cuanto no existen datos, como es de esperar.

Al final, si la petición tuvo éxito se populará el array `metrics` con la respuesta, y se determinará
el tipo de representación (parámetro `mode`). Si éste tiene un valor igual a `grid`, entonces se
representará una tabla de datos con las métricas disponibles. Si tiene un valor `map`, entonces se
las métricas se representarán en un mapa.

```javascript
function getMetrics(mode, sensorId) {
	var path = '/sensors';

	if (sensorId) {
		path += '/' + sensorId;
	}

	var url = 'http://api.mdelapenya-sensors.wedeploy.io' + path;

	return fetch(url)
		.then(function(response) {
			if(response.ok) {
				return response.json();
			}
			else if (response.status !== 200) {
				return [];
			}
		})
		.then(function(metrics) {
			if (!metrics || metrics.length === 0) {
				noResults();

				return;
			}

			if (mode == 'grid') {
				plotMetrics(metrics);
			}
			else {
				mapMetrics(metrics);
			}

			return this;
		});
}
```

El siguiente bloque de código muestra la función `plotMetric`, que a partir de un objeto `metric`,
representado por un objeto JSON de Javascript, genera el marcado HTML para representar una fila en una
tabla, con tantas celdas como atributos tenga el objeto métrica.

```javascript
function plotMetric(metric) {
	return `<tr data-sensor-id="${metric.sensorId}">
	<td><span class="datatable-string ${sensors[i].applicationId}">${metric.applicationId}</span></td>
	<td><span class="datatable-string sensorId">${metric.sensorId}</span></td>
	<td><span class="datatable-string coordinates">${metric.latitude}, ${metric.longitude}</span></td>
	<td><span class="datatable-string metric">${metric.metric}</span></td>
	<td><span class="datatable-string metricUnits">${metric.metricUnits}</span></td>
	<td><span class="datatable-string timestamp">${timeConverter(metric.timestamp)}</span></td>
</tr>`;
}
```

El siguiente bloque de código muestra la función `mapMetrics`, que a partir de un array de métricas,
inicializa el mapa de Google Maps en el que presentarlas.

```javascript
function mapMetrics(metrics) {
	toggleIcons('mapIcon', 'gridIcon');

	metricsContent.classList.add('map');

	initMap(metrics);
}
```

El bloque de código siguiente inicializa el mapa de Google Maps a partir de una colección de métricas,
pasado por parámetro. Se itera por todos ellos para añadir un marcador en el mapa, utilizando el API
de Google Maps para ello:

```javascript
function initMap(metrics) {
	googleMap = new google.maps.Map(metricsContent, {
		center: new google.maps.LatLng(51.508742,-0.120850),
		zoom: 5
	});

	var bounds = new google.maps.LatLngBounds();

	metrics.forEach(function(metric) {
		addMarker(googleMap, bounds, metric);
	});

	googleMap.fitBounds(bounds);
}
```

### Documentos HTML

Los documentos HTML se encuentran directamente en la raíz del proyecto.

En la siguiente imagen aparecen los elementos antes mencionados:

![Estructura del servicio de datos](../static/ui_project_layout.png)

Únicamente existe un fichero HTML de interés, `index.html` que define la estructura de la página y
los bloques de elementos para representar una caja de búsqueda, los iconos de modo de visualización,
y el contenedor cuyo contenido se actualizará con los datos retornados por la petición al API de la
plataforma.