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

import com.wedeploy.api.ApiClient;
import com.wedeploy.api.WeDeploy;
import com.wedeploy.api.sdk.Response;
import com.wedeploy.api.serializer.impl.JoddJsonParser;

import es.mdelapenya.uned.master.is.ubicomp.sensors.pojo.Metric;
import es.mdelapenya.uned.master.is.ubicomp.sensors.pojo.SensorRow;

import java.util.Collection;
import java.util.Collections;

/**
 * @author Manuel de la Peña
 */
public class DataRepository {

	public static DataRepository getInstance() {
		return instance;
	}

	public Collection<SensorRow> wipeOut() {
		WeDeploy weDeploy = new WeDeploy(BASE_SENSORS_DATA_PATH);

		weDeploy.header("Content-Type", "application/json; charset=UTF-8")
			.delete();

		return Collections.EMPTY_LIST;
	}

	public Collection<SensorRow> findBySensorId(String sensorId) {
		WeDeploy weDeploy = new WeDeploy(BASE_SENSORS_DATA_PATH);

		Response response = weDeploy.filter("sensorId", sensorId).get();

		JoddJsonParser parser = new JoddJsonParser();

		return parser.parseAsList(response.body(), SensorRow.class);
	}

	public Collection<SensorRow> findAllSensors() {
		WeDeploy weDeploy = new WeDeploy(BASE_SENSORS_DATA_PATH);

		Response response = weDeploy.get();

		JoddJsonParser parser = new JoddJsonParser();

		return parser.parseAsList(response.body(), SensorRow.class);
	}

	public Response save(Metric sensorMetric) {
		WeDeploy weDeploy = new WeDeploy(BASE_SENSORS_DATA_PATH);

		String body = sensorMetric.toString();

		return weDeploy
			.header("Content-Type", "application/json; charset=UTF-8")
			.header("Content-Length", Long.toString(body.length()))
			.post(body);
	}

	private DataRepository() {
		ApiClient.init();
	}

	private static final String BASE_SENSORS_DATA_PATH = "data/sensors";

	private static DataRepository instance = new DataRepository();

}
