# Lotery

> Se aconseja el uso de Chrome y con la consola abierta pues, aunque se han habilitado eventos y alertas, se muestra mas información de utilidad para guiar en el uso de la aplicación

## Instalación

Se proporcionan los contratos compilados y desplegados en Rinkeby con las siguientes direcciones:

- LotteryFac —> INSERTAR DIRECCIÓN
- User —> INSERTAR DIRECCIÓN

Para comenzar a utilizar la aplicación es necesario únicamente levantar el front por lo que, tras la descarga del repo, es necesario instalar las dependencias:

`$ npm install`

`$ npm run dev`

Esto habilitará el servidor de la aplicación en el puerto `9000` del `localhost`. 

## Funcionalidad

Accediendo a: `http://localhost:9000` (preferiblemente desde Chrome), se obtendrá visualización de la pantalla principal, donde podrán darse de alta los usuarios y realizar apuestas. Además, los usuarios habilitados para ellos podrán realizar la ejecución manual de la lotería y la creación de una nueva lotería.

INSERTAR IMÁGENES DE LAS PANTALLAS

### Alta usuario

Cualquier usuario, antes de participar, debe realizar el alta en la aplicación. Para ello, únicamente tienen que ingresar _mail_ y _teléfono_, la aplicación auotmáticamente adquiere su cuenta de ethereum y la habilita.

### Realización de apuesta

Para la realización de la apuesta, el usuario debe saber inicialmente el id de la lotería, insertarlo en el cajetín y validar pulsando el botón.

### Ejecución manual

Únicamente para usuarios habilitados. En el caso de los contratos desplegados, el usuario habilitado para la ejecución manual es el de la cuenta que he utilizado para el despliegue (`owner`)

## Despliegue de contratos

Se proporcionan los contratos sin compilar. Para el desarrollo se ha utilizado `truffle` con el siguiente versionado

```
Truffle v4.1.12 (core: 4.1.12)
Solidity v0.4.24 (solc-js)
```









