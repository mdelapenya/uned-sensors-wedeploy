/**
 *    Copyright 2017-today Manuel de la Peña
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package es.mdelapenya.uned.master.is.ubicomp.sensors.api;

import es.mdelapenya.uned.master.is.ubicomp.sensors.api.exception.NoSuchSensorException;
import es.mdelapenya.uned.master.is.ubicomp.sensors.api.repository.DataRepository;
import es.mdelapenya.uned.master.is.ubicomp.sensors.pojo.SensorRow;
import es.mdelapenya.uned.master.is.ubicomp.sensors.pojo.SensorMetric;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.Collection;

/**
 * @author Manuel de la Peña
 */
@RestController
@RequestMapping("/sensors")
public class SensorsRestController {

	private final DataRepository dataRepository = DataRepository.getInstance();

	@RequestMapping(method = RequestMethod.GET, value = "/{sensorId}")
	public Collection<SensorRow> getSensor(@PathVariable String sensorId) {
		Collection<SensorRow> rows = dataRepository.findBySensorId(sensorId);

		if (!rows.isEmpty()) {
			return rows;
		}

		throw new NoSuchSensorException(sensorId);
	}

	@RequestMapping(method = RequestMethod.GET)
	public Collection<SensorRow> getSensors() {
		return this.dataRepository.findAllSensors();
	}

	@RequestMapping(method = RequestMethod.POST)
	public ResponseEntity<?> track(@RequestBody SensorMetric inputData) {
		dataRepository.save(
			new SensorMetric(
				inputData.getSensorId(), inputData.getLatitude(),
				inputData.getLongitude(), inputData.getSpeed(),
				inputData.getTimestamp()));

		URI location = ServletUriComponentsBuilder
			.fromCurrentContextPath()
			.path("/sensors/" + inputData.getSensorId())
			.build()
			.toUri();

		return ResponseEntity.created(location).build();
	}

}
