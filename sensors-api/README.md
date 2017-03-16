# Microservicio de API

Este microservicio será el responsable de recibir las peticiones de consulta y modificación de métricas,
enviando dichas peticiones al almacenamiento persistente, que será implementado por otro microservicio
(ver [aquí](../sensors-data/README.md)). Para ello, el API REST ha sido escrito en lenguaje Java en
su versión 8, implementado mediante `Spring Boot`.

La plataforma IoT a desarrollar debe exponer los siguiente recursos REST (o *endpoints*):

* `GET /sensors`: Obtención de todos las métricas de todos los sensores que han enviado al menos una
vez datos a la aplicación.
* `GET /sensors/:sensorId`: Obtención de todos las métricas de un sensor, identificado por su
identificador.
* `POST /sensors`: Envío de una métrica desde un sensor. Los valores que acepta el servicio son los
siguientes:

* el identificador del dispositivo, por ejemplo `ffffffff-e137-0800-d291-847505cc2b1f`.
* el ID de la aplicación, que tendrá siempre como prefijo la palabra `sensors-`, seguido por el
identificador de la plataforma en la que está instalada, por ejemplo `sensors-android`, `sensors-ios`, etc.
* las coordenadas en formato latitud y longitud.
* el valor de la métrica, por ejemplo `4.25`.
* el tipo de métrica, en formato texto. Ejemplos de este valor podrían ser `"speed"`, `"temperature"`,
`"pressure"`, etc.
* las unidades en que se expresa la métrica, en formato texto, por ejemplo `"km/h"`, `"Celsius"`,
`"bar"`, etc. 
* un timestamp con la marca de tiempo del momento de la petición.

## Sistema de Build

Para la construcción del microservicio que representa el API, tal y como es habitual en los proyectos
*Java*, se ha utilizado **Gradle**, en su versión 3.3.

Gradle es un sistema de construcción especializado para el mundo de la máquina virtual Java (JVM).
Gradle proporciona:

* una herramienta de construcción de propóstio general y muy flexible, parecido a Apache Ant.
* proporciona frameworks intercambiables, basados en construcción-por-convención, al estilo de Maven.
* soporte de construcción de proyectos multi-proyecto muy potente.
* gestión de dependencias muy potente, basado en Apache Ivy.
* soporte completo para infraestructuras de repositorios Maven o Ivy existentes.
* soporte para gestión de dependencias transitivas, sin la necesidad de repositorios remotos, o ficheros
`pom.xml` o `ivy.xml`.
* tareas Ant y construcciones tratadas como ciudadanos de primera clase.
* scripts de construcción de `Groovy`.
* un modelo de dominio muy rico para describir el sistema de construcción de cada proyecto.

En el caso concreto de Spring Boot, para el microservicio que representa el API, no se utiliza nada
fuera del estándar, basando el sistema de construcción en el *default* que ofrece el plugin de Spring
Boot. Por ello, las tareas de construcción utilizadas son: `clean`, `build`, `test`.

El diagrama de interacción entre las diferentes tareas de Gradle es el siguiente:

![Diagrama de tareas de Gradle](../static/gradle_diagram.png)

En cuanto a la gestión de dependencias, se utilizan los repositorios de `jcenter`, los propios de
`Spring`, los repositorios de `jitpack.io`, que son una abstracción de proyectos alojados directamente
en `Github` obteniendo sus releases, y por último la instalación local de Maven, ubicada en `$USER_HOME/.m2`,
tal y como se observa en el fichero *build.gradle*.

```groovy
repositories {
  mavenLocal()
  jcenter()
  mavenCentral()
  maven { url "http://repo.spring.io/release" }
  maven {
    url "https://jitpack.io"
  }
}
```

## Dependencias externas

El microservicio de API utiliza un conjunto de clases Java de propósito general, escritas para abstraer
el modelo de datos de la aplicación. Estas clases, empaquetas en la librería `sensors-pojo-api.jar`,
constituyen un proyecto independiente, disponible en [el siguiente enlace](https://github.com/mdelapenya/uned-sensors-pojos-api).

Se ha tomado esta consideración para poder reutilizar tales clases tanto en este microservicio, como
en la aplicación Android, de modo que ambas utilicen las mismas versiones de la librería. En este caso,
se ha optado por utilizar la versión definida por el último commit en la rama `master` del repositorio:

```groovy
dependencies {
  compile 'com.github.mdelapenya:uned-sensors-pojos-api:master-SNAPSHOT'
  ...
}
```

Por otro lado, es necesario utilizar una librería cliente de **WeDeploy**, en este caso para el lenguaje
de programación Java. Esta librería se encuentra disponible en Github, de modo que pueda ser gestionada
su dependencia mediante **jitpack**.

```groovy
dependencies {
  ...
  compile("com.github.wedeploy.api-java:api:master-SNAPSHOT")
  compile("com.github.wedeploy.api-java:api-client:master-SNAPSHOT")
  ...
}
```

## Estructura del proyecto

Al utilizar Gradle como sistema de build, el proyecto sigue un `layout` específico determinado por la
convención de nombres y directorios propia de Gradle.

Según esta convención, la aplicación estará dentro de un directorio `sensors-api`, y dentro de este
directorio existirá un `src`, así como algunos ficheros descriptores, como por ejemplo el `build.gradle`.
Dentro de `src` se sigue una estructura igual a la definida por `Maven`:

* `src/main/java` para el código de la aplicación
* `src/main/resources` para los ficheros de configuración de Spring, así como los recursos estáticos
de la aplicación: páginas HTML de error y CSS, por ejemplo.
* `src/test` para los tests unitarios.
* `src/testIntegration` para los tests de integración.

En la siguiente imagen aparecen los elementos antes mencionados:

![Estructura de proyecto en Gradle](../static/api_gradle_project_layout.png)

Además, el microservicio dispone de un descriptor propio de **WeDeploy**, en el que se define el
tipo de servicio en formato JSON. Al ser un proyecto basado en Java, en este descriptor se indican
además los comandos necesarios para construir el proyecto.

```json
{
    "id": "api",
    "type": "wedeploy/java:latest",
    "hooks": {
        "before_build": "",
        "build": "gradle -Dorg.gradle.native=false clean build -x test",
        "after_build": "",
        "before_start": "",
        "start": "",
        "after_start": ""
    }
}
```

Para consultar el descriptor del servicio, por favor seguir [este enlace](./container.json).

Por otro lado, en el desarrollo de la aplicación se ha utilizado una estructura de paquetes adecuada
para realizar la separación lógica entre los diferentes componentes de la misma.

A continuación se enumeran los paquetes de la aplicación, que como hemos mencionado antes, se ubican
bajo el directorio `app/src/main/java` del proyecto.

### Paquete Exception

Las clases que aquí se encuentran representan las excepciones propias escritas para identificar los
tipos de error específicos de la aplicación. Se encuentran bajo el paquete
`es.mdelapenya.uned.master.is.ubicomp.sensors.api.exception`.

En este caso, se ha escrito únicamente una clase, `NoSuchSensorException`, que será procesada cuando
el recurso asociado a un sensor identificado por su identificador no sea encontrado. Se corresponderá
con el código de estado 404 `NOT FOUND` de HTTP.

### Paquete Repository

Las clases que aquí se encuentran representan el acceso al repositorio de datos de la aplicación. Se
encuentran bajo el paquete `es.mdelapenya.uned.master.is.ubicomp.sensors.api.repository`.

En este caso, el repositorio de datos viene representado por un servicio, que será el responsable de
abstraer el acceso a los datos. Este servicio leerá y escribirá las métricas en el servicio de datos
de **WeDeploy**, que se corresponde con una instancia de almacenamiento `NoSQL` implementado con
`ElasticSearch`. 

Las operaciones que se realizarán en el repositorio de datos serán las mismas definidas por el API:
consulta de sensores, consulta de un sensor, y envío de una métrica de un sensor.

El método **findSensorById** recuperará los datos de un sensor, identificado por su identificador.
Para ello instanciará un objeto del API Java del PaaS **WeDeploy**, pasándole la URL del servicio de
datos, filtrará los resultados por el campo `sensorId` y parseará el resultado obtenido de una colección
de objetos JSON a una colección de objetos Java del tipo `SensorRow`.

```java
    public Collection<SensorRow> findBySensorId(String sensorId) {
		WeDeploy weDeploy = new WeDeploy(BASE_SENSORS_DATA_PATH);

		Response response = weDeploy.filter("sensorId", sensorId).get();

		JoddJsonParser parser = new JoddJsonParser();

		return parser.parseAsList(response.body(), SensorRow.class);
	}
```

El método **findAllSensors** recuperará los datos de todos los sensores en el repositorio. Para ello
instanciará un objeto del API Java del PaaS **WeDeploy**, pasándole la URL del servicio de datos, y
parseará el resultado obtenido de una colección de objetos JSON a una colección de objetos Java del
tipo `SensorRow`.

```java
	public Collection<SensorRow> findAllSensors() {
		WeDeploy weDeploy = new WeDeploy(BASE_SENSORS_DATA_PATH);

		Response response = weDeploy.get();

		JoddJsonParser parser = new JoddJsonParser();

		return parser.parseAsList(response.body(), SensorRow.class);
	}
```

El método **save** enviará al almacenamiento persistente los datos de una métrica. Para ello instanciará
un objeto del API Java del PaaS **WeDeploy**, pasándole la URL del servicio de datos, y realizará una
petición `POST` de HTTP con las cabeceras adecuadas (tipo del contenido y longitud del mismo) y el
objeto Java serializado a JSON.

```java
	public Response save(Metric sensorMetric) {
		WeDeploy weDeploy = new WeDeploy(BASE_SENSORS_DATA_PATH);

		String body = sensorMetric.toString();

		return weDeploy
			.header("Content-Type", "application/json; charset=UTF-8")
			.header("Content-Length", Long.toString(body.length()))
			.post(body);
	}
```

En el momento de la redacción de este documento, la serialización nativa con Jackson no está implementada,
por tanto el objeto JSON se construye mediante la concatenación de Strings en el método `toString()`
de la clase `SensorMetric`.

### Paquete raíz

En este paquete se encuentran las clases de inicialización de la aplicación, así como el controlador
principal de la misma.

Se entiende por controlador aquella clase responsable de dirigir el flujo de la aplicación de la vista
al modelo, y viceversa, en el patrón MVC (*Model - View - Controller*).

Respecto a la clase de inicialización, `SensorsApiApplication.java` se trata de una clase con un único
método `main` que utilizando `Spring Boot` realizará el startup de la aplicación.

```java
    public static void main(String[] args) {
        SpringApplication.run(SensorsApiApplication.class, args);
    }
```

En cuanto al único controlador de la aplicación, la clase `SensorsRestController.java`, podemos observar
que ésta está anotada con las anotaciones `@RestController` y `@RequestMapping("/sensors")`. Dichas
anotaciones le indican a `Spring` que enrute las peticiones HTTP al path `/sensors` a los diferentes
métodos de la clase.

Cada uno de los métodos de la clase estarán anotados a su vez con la anotación `@RequestMapping`, que
define el mapeo adecuado al verbo HTTP indicado en la parametrización de la anotación. Por ejemplo:

```java
    @RequestMapping(method = RequestMethod.DELETE)
    public Collection<SensorRow> delete() {...}

    @RequestMapping(method = RequestMethod.GET, value = "/{sensorId}")
    public Collection<SensorRow> getSensor(@PathVariable String sensorId) {...}

    @RequestMapping(method = RequestMethod.GET)
    public Collection<SensorRow> getSensors() {...}

    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity<?> track(@RequestBody Metric metric) {...}
```

Para el caso del método `getSensor(@PathVariable String sensorId)`, la anotación `@PathVariable` le
indica a `Spring` que en el path `/sensors` de la aplicación se admitirán peticiones al recurso principal,
tomando todo lo que llegue detrás de la barra tras `/sensors/` como un parámetro al método, siguiendo
los patrones de diseño de REST.

Para el caso del método `track(@RequestBody Metric metric)`, responsable de manejar las peticiones
HTTP POST que recibe la aplicación, la anotación `@RequestBody` indica que la petición debe contener
un objeto en formato JSON que pueda ser parseado al objeto `Metric`, de modo que los campos del objeto
JSON se correspondan con los atributos de la clase `Metric`. Este parseo lo realizan las clases de la
librería de serialización y parseo JSON `Jackson`, incluída por defecto en `Spring Boot`.