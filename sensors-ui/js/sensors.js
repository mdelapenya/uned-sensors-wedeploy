var googleMap;
var metricsContent = document.getElementById('metricsContent');

function addMarker(map, bounds, sensor) {
	var latLong = {lat: parseFloat(sensor.latitude), lng: parseFloat(sensor.longitude)};
	var date = timeConverter(sensor.timestamp);

	var title = sensor.sensorId + ' - ' + sensor.applicationId + '(' + date + ')';

	var marker = new google.maps.Marker({
		position: latLong,
		map: map,
		title: title
	});

	bounds.extend(marker.position);

	var contentString = `<div class="metric">
	<h3>${sensor.sensorId}</h3>
	<h4>${sensor.latitude}, ${sensor.longitude}</h4>
	<p>Metric: ${sensor.metric} ${sensor.metricUnits}, read on ${date}, from ${sensor.applicationId}</p>
</div>`;

	var infoWindow = new google.maps.InfoWindow();

	infoWindow.setContent(contentString);

	marker.addListener('click', function() {
		infoWindow.open(map, marker);
	});
}

function getFooter(sensors) {
	return `<div class="table-footer">
		<div class="table-footer-left"></div>
			<div class="table-footer-right">
				<div class="hidden-xs table-footer-dropdown form-group-select">
					<div class="table-footer-pagination">
						<label>1-${sensors.length} of ${sensors.length} items</label>
					</div>
				</div>
			</div>
		</div>
	</div>`;
}

function getSensors(mode, sensorId) {
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
		.then(function(sensors) {
			if (!sensors || sensors.length === 0) {
				noResults();

				return;
			}

			if (mode == 'grid') {
				plotSensors(sensors);
			}
			else {
				mapSensors(sensors);
			}

			return this;
		});
}

function initMap(sensors) {
	googleMap = new google.maps.Map(metricsContent, {
		center: new google.maps.LatLng(51.508742,-0.120850),
		zoom: 5
	});

	var bounds = new google.maps.LatLngBounds();

	sensors.forEach(function(sensor) {
		addMarker(googleMap, bounds, sensor);
	});

	googleMap.fitBounds(bounds);
}

function mapSensors(sensors) {
	toggleIcons('mapIcon', 'gridIcon');

	metricsContent.classList.add('map');

	initMap(sensors);
}

function noResults() {
	metricsContent.innerHTML = `<div class="empty-data">
	<div class="project-notfound">
		<div class="project-notfound-icon">
			<span class="icon-16-database"></span>
		</div>
		<p class="project-notfound-text">No results found.</p>
	</div>
</div>`;
}

function plotSensor(sensor) {
	return `<tr data-sensor-id="${sensor.sensorId}">
	<td><span class="datatable-string ${sensors[i].applicationId}">${sensor.applicationId}</span></td>
	<td><span class="datatable-string sensorId">${sensor.sensorId}</span></td>
	<td><span class="datatable-string coordinates">${sensor.latitude}, ${sensor.longitude}</span></td>
	<td><span class="datatable-string metric">${sensor.metric}</span></td>
	<td><span class="datatable-string metricUnits">${sensor.metricUnits}</span></td>
	<td><span class="datatable-string timestamp">${timeConverter(sensor.timestamp)}</span></td>
</tr>`;
}

function plotSensors(sensors) {
	var html = '';

	metricsContent.classList.remove('map');

	if (sensors.length > 0) {
		html += `<div class="datatable">
	<span class="datatable-array-object">
		<table class="table table-bordered table-condensed table-hover">
			<thead>
				<tr>
					<th>application-id<span class="datatable-type">string</span></th>
					<th>sensor-id<span class="datatable-type">string</span></th>
					<th>coordinates<span class="datatable-type">string</span></th>
					<th>metric<span class="datatable-type">string</span></th>
					<th>units<span class="datatable-type">string</span></th>
					<th>timestamp<span class="datatable-type">date</span></th>
				</tr>
			</thead>
			<tbody>`;
	}

	for(var i = 0; i < sensors.length; i++) {
		html += plotSensor(sensors[i]);
	}

	if (sensors.length > 0) {
		html += `</tbody>
			</table>
		</span>
	</div>`;

		html += getFooter(sensors);
	}

	toggleIcons('gridIcon', 'mapIcon');

	metricsContent.innerHTML = html;
}

function search() {
	var icon = 'grid';

	var mapIcon = document.getElementById('mapIcon');

	if (mapIcon.classList.contains('btn-icon-selected')) {
		icon = 'map';
	}

	var sensorId = document.getElementById('txtSearch').value;

	getSensors(icon, sensorId);
}

function timeConverter(timestamp){
	var currentDate = new Date(parseInt(timestamp));

	return currentDate.toLocaleString();
}

function toggleIcons(activeIconId, inactiveIconId) {
	var activeIcon = document.getElementById(activeIconId);
	var inactiveIcon = document.getElementById(inactiveIconId);

	activeIcon.classList.toggle("btn-icon-selected");
	inactiveIcon.classList.remove("btn-icon-selected");

	metricsContent.style = '';
}
