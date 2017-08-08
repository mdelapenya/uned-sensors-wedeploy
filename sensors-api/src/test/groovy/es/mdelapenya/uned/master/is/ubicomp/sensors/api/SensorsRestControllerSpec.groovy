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

package es.mdelapenya.uned.master.is.ubicomp.sensors.api

import es.mdelapenya.uned.master.is.ubicomp.sensors.pojo.SensorMetric

import groovyx.net.http.RESTClient

import spock.lang.Shared
import spock.lang.Specification
import spock.lang.Unroll

class SensorsRestControllerSpec extends Specification {

	@Shared
	def SENSOR_ID = "sensorId"

	@Shared
	RESTClient restClient

	@Shared
	def initialCount

	def cleanupSpec() {
		restClient.delete(
			path : "/sensors/" + SENSOR_ID,
			contentType:'application/json'
		)
	}

	def setupSpec() {
		restClient = new RESTClient("https://sensorsapi-mdelapenya.wedeploy.io")

		restClient.headers.Accept = 'application/json'
		restClient.handler.failure  = restClient.handler.success

		def listResponse = restClient.get(path : "/sensors")
		initialCount = listResponse.data.size()
	}

	@Unroll("Check that #expectedHttpStatus is the HTTP status for #path endpoint")
	def 'Check endpoints'() {
		when: "when requesting a resource"
		def response = restClient.get( path: path)

		then: "HTTP status is #expectedHttpStatus"
		assert response.status == expectedHttpStatus

		where:
		path            | expectedHttpStatus
		"/"             | 404
		"/sensors"      | 200
		"/sensors/foo"  | 404
	}

	def "Creating a metric"() {
		when: "a new metric is created"
		def metric = new SensorMetric(
			SENSOR_ID, "spock-test", 39.862846,
			-4.024904, 21, "temperature", "Celsius",
			new Date().getTime())

		restClient.post(
			path : "/sensors",
			body: metric.toString(),
			contentType:'application/json'
		)

		and: "metrics list is requested"
		def listResponse = restClient.get(path : "/sensors")

		then: "metrics list should contain one more element"
		assert initialCount +1 == listResponse.data.size()
	}

}