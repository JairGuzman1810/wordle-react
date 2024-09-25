# Wordle Clone App

Este repositorio contiene el código fuente de un clon de Wordle desarrollado con React Native y Expo. La aplicación está diseñada para ofrecer una experiencia de juego divertida y desafiante, permitiendo a los usuarios adivinar palabras en español o inglés. A continuación, se detallan las características principales de esta aplicación:

## Características clave para usuarios

- **Juego de Palabras**: Adivina la palabra oculta utilizando pistas de color para cada intento.
- **Temas Personalizables**: Cambia entre modos de tema claro y oscuro.
- **Modo Español**: Cambia a una lista de palabras en español, reiniciando el juego automáticamente.
- **Cuenta de Usuario**: Permite crear una cuenta y guardar información sobre las partidas, incluyendo las ganadas consecutivas y las ganadas en total.
  
## Tecnologías y dependencias principales

### Expo Router
Utilizado para la navegación dentro de la aplicación. Permite definir rutas y gestionar la navegación de manera eficiente.

### React Native Reanimated
Esta dependencia se utiliza para implementar animaciones fluidas y mejorar la experiencia del usuario en la aplicación.

### Firebase
Proporciona servicios de backend, como la autenticación y la gestión de datos, lo que permite a los usuarios guardar sus progresos y estadísticas.

### MMKV
Usado para almacenar de manera eficiente el estado del modo oscuro y el modo español, permitiendo que la aplicación recuerde las preferencias del usuario entre sesiones.

### Clerk
Usado para la autenticación de usuarios, proporcionando un inicio de sesión seguro y fácil.


## Lista completa de dependencias

```json
  "dependencies": {
    "@clerk/clerk-expo": "^2.2.10",
    "@expo-google-fonts/frank-ruhl-libre": "^0.2.3",
    "@expo/vector-icons": "^14.0.2",
    "@gorhom/bottom-sheet": "^4.6.4",
    "@jsamr/counter-style": "^2.0.2",
    "@jsamr/react-native-li": "^2.3.1",
    "@react-navigation/native": "^6.0.2",
    "date-fns": "^4.0.0-beta.1",
    "expo": "~51.0.28",
    "expo-constants": "~16.0.2",
    "expo-dev-client": "~4.0.26",
    "expo-font": "~12.0.9",
    "expo-linking": "~6.3.1",
    "expo-local-authentication": "~14.0.1",
    "expo-router": "~3.5.23",
    "expo-secure-store": "~13.0.2",
    "expo-splash-screen": "~0.27.5",
    "expo-status-bar": "~1.12.1",
    "expo-system-ui": "~3.0.7",
    "expo-web-browser": "~13.0.3",
    "firebase": "^10.13.2",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "react-native": "0.74.5",
    "react-native-gesture-handler": "~2.16.1",
    "react-native-mmkv": "2.12.2",
    "react-native-reanimated": "~3.10.1",
    "react-native-safe-area-context": "4.10.5",
    "react-native-screens": "3.31.1",
    "react-native-svg": "15.2.0",
    "react-native-web": "~0.19.10"
  }
```


## Configuración e instalación

### Clonar el repositorio

1. Clona este repositorio en tu máquina local:
   
```sh
git clone "https://github.com/JairGuzman1810/wordle-react"
```
2. Clona este repositorio en tu máquina local:
   
```sh
cd wordle-react
```

### Instalar dependencias

1. Ejecuta el siguiente comando para instalar todas las dependencias necesarias:

```sh
npm install
```

2. O si prefieres usar yarn:

```sh
yarn install
```

## Configuración de las variables de entorno
Crea un archivo .env en la raíz del proyecto y añade las siguientes variables de entorno (reemplaza con tus propios valores):
```
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=tu_clerk_publishable_key 
EXPO_PUBLIC_API_KEY=tu_api_key 
EXPO_PUBLIC_AUTH_DOMAIN=tu_auth_domain 
EXPO_PUBLIC_PROJECT_ID=tu_project_id 
EXPO_PUBLIC_STORAGE_BUCKET=tu_storage_bucket 
EXPO_PUBLIC_MESSAGING_SENDER_ID=tu_messaging_sender_id 
EXPO_PUBLIC_APP_ID=tu_app_id
```
### Ejecutar la aplicación

1. Una vez que hayas instalado todas las dependencias, puedes ejecutar la aplicación utilizando el siguiente comando:

```sh
npm run:android
```

## Capturas de pantalla de la aplicación

<div style="display:flex; flex-wrap:wrap; justify-content:space-between;">
    <img src="https://github.com/JairGuzman1810/wordle-react/blob/master/src/screens/App-1.gif" alt="Captura de pantalla 1" width="180"/>
    <img src="https://github.com/JairGuzman1810/wordle-react/blob/master/src/screens/App-2.jpg" alt="Captura de pantalla 2" width="180"/>
    <img src="https://github.com/JairGuzman1810/wordle-react/blob/master/src/screens/App-3.jpg" alt="Captura de pantalla 3" width="180"/>
    <img src="https://github.com/JairGuzman1810/wordle-react/blob/master/src/screens/App-4.gif" alt="Captura de pantalla 4" width="180"/>
</div>
<div style="display:flex; flex-wrap:wrap; justify-content:space-between;">
    <img src="https://github.com/JairGuzman1810/wordle-react/blob/master/src/screens/App-5.jpg" alt="Captura de pantalla 5" width="180"/>
    <img src="https://github.com/JairGuzman1810/wordle-react/blob/master/src/screens/App-6.gif" alt="Captura de pantalla 6" width="180"/>
    <img src="https://github.com/JairGuzman1810/wordle-react/blob/master/src/screens/App-7.gif" alt="Captura de pantalla 7" width="180"/>
    <img src="https://github.com/JairGuzman1810/wordle-react/blob/master/src/screens/App-8.jpg" alt="Captura de pantalla 8" width="180"/>
</div>
