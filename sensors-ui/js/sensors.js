function getSensors(mode) {
	return WeDeploy.data('data.mdelapenya-sensors.wedeploy.io')
		.get('sensors')
		.then(function(sensors) {
			if (mode == 'grid') {
				plotSensors(sensors);
			}
			else {
				mapSensors(sensors);
			}

			return this;
		});
}

function mapSensors(sensors) {
	var html = '';
	var list = document.getElementById('sensorsList');

	list.innerHTML = html;

	var gridIcon = document.getElementById('gridIcon');
	var mapIcon = document.getElementById('mapIcon');

	mapIcon.classList.toggle("btn-icon-selected");
	gridIcon.classList.remove("btn-icon-selected");
}

function plotSensors(sensors) {
	var html = '';
	var footer = '';
	var list = document.getElementById('sensorsList');

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
		html += `<tr data-sensor-id="${sensors[i].sensorId}">
	<td><span class="datatable-string ${sensors[i].applicationId}">${sensors[i].applicationId}</span></td>
	<td><span class="datatable-string sensorId">${sensors[i].sensorId}</span></td>
	<td><span class="datatable-string coordinates">${sensors[i].latitude}, ${sensors[i].longitude}</span></td>
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

		footer += `<div class="table-footer">
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

		html += footer;
	}

	var gridIcon = document.getElementById('gridIcon');
	var mapIcon = document.getElementById('mapIcon');

	gridIcon.classList.toggle("btn-icon-selected");
	mapIcon.classList.remove("btn-icon-selected");

	list.innerHTML = html;
}

function timeConverter(timestamp){
	var currentDate = new Date(parseInt(timestamp));

	return currentDate.toLocaleString();
}
