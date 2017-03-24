var googleMap;
var metricsContent = document.getElementById('metricsContent');

function addMarker(map, bounds, metric) {
	var latLong = {lat: parseFloat(metric.latitude), lng: parseFloat(metric.longitude)};
	var date = timeConverter(metric.timestamp);

	var title = metric.sensorId + ' - ' + metric.applicationId + '(' + date + ')';

	var marker = new google.maps.Marker({
		position: latLong,
		map: map,
		title: title
	});

	bounds.extend(marker.position);

	var contentString = `<div class="metric">
	<h3>${metric.sensorId}</h3>
	<h4>${metric.latitude}, ${metric.longitude}</h4>
	<p>Metric: ${metric.metric} ${metric.metricUnits}, read on ${date}, from ${metric.applicationId}</p>
</div>`;

	var infoWindow = new google.maps.InfoWindow();

	infoWindow.setContent(contentString);

	marker.addListener('click', function() {
		infoWindow.open(map, marker);
	});
}

function getFooter(metrics) {
	return `<div class="table-footer">
		<div class="table-footer-left"></div>
			<div class="table-footer-right">
				<div class="hidden-xs table-footer-dropdown form-group-select">
					<div class="table-footer-pagination">
						<label>1-${metrics.length} of ${metrics.length} items</label>
					</div>
				</div>
			</div>
		</div>
	</div>`;
}

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

function mapMetrics(metrics) {
	toggleIcons('mapIcon', 'gridIcon');

	metricsContent.classList.add('map');

	initMap(metrics);
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

function plotMetrics(metrics) {
	var html = '';

	metricsContent.classList.remove('map');

	if (metrics.length > 0) {
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

	for(var i = 0; i < metrics.length; i++) {
		html += plotMetric(metrics[i]);
	}

	if (metrics.length > 0) {
		html += `</tbody>
			</table>
		</span>
	</div>`;

		html += getFooter(metrics);
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

	getMetrics(icon, sensorId);
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
