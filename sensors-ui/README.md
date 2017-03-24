# Microservicio de Interfaz de Usuario

Este microservicio será el responsable de mostrar las métricas almacenadas en el almacenamiento
persistente. Para ello, la interfaz de usuario se ha escrito en HTML5, CSS3 y Javascript del lado del
cliente.

Para consultar los datos relativos a las métricas almacenadas, este microservicio no utiliza el
microservicio de datos, sino que siempre pide estos datos a través del microservicio del API, utilizando
los *endpoints* de lectura expuestos por éste, representados por dos recursos de acceso a las métricas:
el primero recuperando todas las existentes, y el segundo recuperando todas las métricas asociadas a
un sensor. Por tanto se podrá desarrollar una aplicación en la tecnología deseada que permita el
consumo de los datos expuestos por el API REST utilizando los verbos HTTP adecuados.

## Estructura del proyecto

El microservicio de interfaz de usuario contiene únicamente un descriptor, propio de **WeDeploy**, en
formato JSON. El descriptor viene definido por el fichero `container.json` que especifica a la
plataforma **WeDeploy** que el servicio actual es del tipo `hosting`, así como le asigna un identificador
único, en este caso `ui`.

```json
{
	"id": "ui",
	"type": "wedeploy/hosting"
}
```

Para consultar el descriptor del servicio de hosting de **WeDeploy**, por favor seguir [este enlace](./container.json).

En cuanto al resto de ficheros estáticos, tanto HTML, como CSS y JS, se organizan de la siguiente manera:

### Directorio _error

**WeDeploy** define un convenio de nombres para tratar los mensaje de error de HTTP, de modo que a
cada código de error HTTP (404, 500, etc.) le corresponde un documento HTML cuyo nombre coincide con
el código de error, por ejemplo `404.html`. Estos ficheros se encuentran bajo el directorio `_errors`.

### Hojas de estilo

Las hojas de estilo CSS se encuentran bajo el directorio `css`.

### Scripts de Javascript

Los ficheros de script de Javascript se encuentran bajo el directorio `js`. Será en estos ficheros
donde se escriba la lógica del código a ejecutar en el cliente (navegador).

### Documentos HTML

Los documentos HTML se encuentran directamente en la raíz del proyecto.

En la siguiente imagen aparecen los elementos antes mencionados:

![Estructura del servicio de datos](../static/ui_project_layout.png)


