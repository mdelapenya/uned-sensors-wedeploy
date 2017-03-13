function getSensors(type) {
	return WeDeploy.data('data.mdelapenya-sensors.wedeploy.io')
		.get('sensors')
		.then(function(sensors) {
			plotSensors(sensors);

			return this;
		});
}

function plotSensors(sensors) {
	var html = '';
	var list = document.getElementById('sensorsList');

	if (sensors.length > 0) {
		html += `<ul class="list-group">`;
	}

	for(var i = 0; i < sensors.length; i++) {
		html += `<li class="listitem list-group-item clearfix ${sensors[i].applicationId}" data-sensor-id="${sensors[i].sensorId}">
					<span class="sensorId">${sensors[i].sensorId}</span>
					&nbsp;-&nbsp;
					<span class="metric">${sensors[i].metric}</span>
					&nbsp;-&nbsp;
					<span class="metricUnits">${sensors[i].metricUnits}</span>
				</li>`;
	}

	if (sensors.length > 0) {
		html += `</ul>`;
	}

	list.innerHTML = html;
}