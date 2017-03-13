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
		html += `<div class="datatable">
	<span class="datatable-array-object">
		<table class="table table-bordered table-condensed table-hover">
			<thead>
				<tr>
					<th>application-id<span class="datatable-type">string</span></th>
					<th>sensor-id<span class="datatable-type">string</span></th>
					<th>metric<span class="datatable-type">string</span></th>
					<th>units<span class="datatable-type">string</span></th>
					<th>timestamp<span class="datatable-type">date</span></th>
				</tr>
			</thead>
			<tbody>`;
	}

	for(var i = 0; i < sensors.length; i++) {
		html += `<tr data-sensor-id="${sensors[i].sensorId}">
	<td><span class="datatable-string ${sensors[i].applicationId}">${sensors[i].applicationId}</span></td>
	<td><span class="datatable-string sensorId">${sensors[i].sensorId}</span></td>
	<td><span class="datatable-string metric">${sensors[i].metric}</span></td>
	<td><span class="datatable-string metricUnits">${sensors[i].metricUnits}</span></td>
	<td><span class="datatable-string timestamp">${timeConverter(sensors[i].timestamp)}</span></td>
</tr>`;
	}

	if (sensors.length > 0) {
		html += `</tbody>
			</table>
		</span>
	</div>`;
	}

	list.innerHTML = html;
}

function timeConverter(timestamp){
	var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	var currentDate = new Date(timestamp * 1000);

	var year = currentDate.getFullYear();
	var month = months[currentDate.getMonth()];
	var date = currentDate.getDate();
	var hour = currentDate.getHours();
	var min = currentDate.getMinutes();
	var sec = currentDate.getSeconds();

	return date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
}