# Geo Map App

## Description
Application provides access to map features such as marking varied location and sharing its coordinates, enables to create polygon and export it in the form of csv files and support navigation through bearing angle calculation.

## Installation
### React Native

```bash
npm install -g react-native-cli
npm install --save react-navigation
npm install --save react-native-gesture-handler
```
For IOS:
```bash
react-native link react-native-gesture-handler
```

For Android:

Refer https://reactnavigation.org/docs/en/getting-started.html

### Installing all dependencies

```bash
npm install
```
### Google Maps API key

Add your API key in map/android/app/src/main/AndroidManifest.xml 
```
<meta-data
        android:name="com.google.android.geo.API_KEY"
        android:value="Google_API_KEY"/>
```

## Build and Run

For IOS:
```bash
react-native run-ios
```

For Android:
```bash
react-native run-android
```
