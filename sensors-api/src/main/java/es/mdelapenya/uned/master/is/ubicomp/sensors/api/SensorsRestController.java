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

import es.mdelapenya.uned.master.is.ubicomp.sensors.api.model.Sensor;
import es.mdelapenya.uned.master.is.ubicomp.sensors.api.repository.DataRepository;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;

/**
 * @author Manuel de la Peña
 */
@RestController
@RequestMapping("/sensors")
public class SensorsRestController {

	private final DataRepository dataRepository = new DataRepository();

	@RequestMapping(method = RequestMethod.GET, value = "/{sensorId}")
	public Sensor getSensor(@PathVariable String sensorId) {
		return dataRepository.findBySensorId(sensorId);
	}

	@RequestMapping(method = RequestMethod.GET)
	public Collection<Sensor> getSensors() {
		return this.dataRepository.findAllSensors();
	}

}