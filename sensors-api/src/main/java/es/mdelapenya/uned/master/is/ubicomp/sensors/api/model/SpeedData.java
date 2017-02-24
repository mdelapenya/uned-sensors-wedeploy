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

package es.mdelapenya.uned.master.is.ubicomp.sensors.api.model;

import java.io.Serializable;

/**
 * @author Manuel de la Peña
 */
public class SpeedData implements Serializable {

	public SpeedData() {
	}

	public SpeedData(
		String sensorId, double latitude, double longitude, double speed,
		long timestamp) {

		this.sensorId = sensorId;
		this.latitude = latitude;
		this.longitude = longitude;
		this.speed = speed;
		this.timestamp = timestamp;
		
	}

	public double getLatitude() {
		return latitude;
	}

	public double getLongitude() {
		return longitude;
	}

	public String getSensorId() {
		return sensorId;
	}

	public double getSpeed() {
		return speed;
	}

	public long getTimestamp() {
		return timestamp;
	}

	private double latitude;
	private double longitude;
	private String sensorId;
	private double speed;
	private long timestamp;

}