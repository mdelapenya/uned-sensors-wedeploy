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

package es.mdelapenya.uned.master.is.ubicomp.sensors.api.repository;

import es.mdelapenya.uned.master.is.ubicomp.sensors.api.model.Sensor;
import es.mdelapenya.uned.master.is.ubicomp.sensors.api.model.SpeedData;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.List;

/**
 * @author Manuel de la Peña
 */
public class DataRepository {

	public Sensor findBySensorId(String sensorId) {
		List<SpeedData> data = new ArrayList<>();

		for (int j = 0; j < 10; j++) {
			data.add(mockData(sensorId));
		}

		return new Sensor(sensorId, data);
	}

	public Collection<Sensor> findAllSensors() {
		List<Sensor> sensors = new ArrayList<>();

		for (int i = 0; i < 10; i++) {
			String sensorId = "" + i;

			List<SpeedData> data = new ArrayList<>();

			for (int j = 0; j < 10; j++) {
				data.add(mockData(sensorId));
			}

			sensors.add(new Sensor(sensorId, data));
		}

		return sensors;
	}

	public SpeedData save(SpeedData speedData) {
		SpeedData savedSpeedData = new SpeedData(
			speedData.getSensorId(), speedData.getLatitude(),
			speedData.getLongitude(), speedData.getSpeed(),
			speedData.getTimestamp());

		return savedSpeedData;
	}

	private SpeedData mockData(String sensorId) {
		double latitude = Math.random();
		double longitude = Math.random();
		double speed = Math.random();

		return new SpeedData(
			sensorId, latitude, longitude, speed, new Date().getTime());
	}

}