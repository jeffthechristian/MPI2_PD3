import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, //Dimensions,
 TouchableOpacity } from 'react-native';
import Constants from 'expo-constants';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const API_KEY = '126c56d5cb7bfcc040bdb11c937105f9';

const App = () => {
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);


  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let { coords } = await Location.getCurrentPositionAsync({});
      setLocation(coords);
    })();
  }, []);

  const fetchWeather = async () => {
    if (!location) {
      return;
    }

    const { latitude, longitude } = location;
    const apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`;

    try {
      const response = await fetch(apiURL);
      const data = await response.json();
      setWeather(data);
    } catch (error) {
      console.log('Error fetching weather data', error);
    }
  };

  return (
    <View style={styles.container}>
      {location ? (
        <MapView
          style={styles.map}
          showsUserLocation
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }} />
        </MapView>
      ) : (
        <Text>Loading...</Text>
      )}
      {weather && (
        <View style={styles.weatherContainer}>
          <Text style={styles.weatherText}>
            {weather.name}: {weather.weather[0].main} ({weather.main.temp}°C)
          </Text>
          <Text style={styles.weatherText}>
            
          </Text>
          <Text style={styles.weatherText}>
            lat: {location.latitude} 
          </Text>
          <Text style={styles.weatherText}>
            long: {location.longitude} 
          </Text>
          <Text style={styles.weatherText}>
            humidity: {weather.main.humidity}  
          </Text>
          <Text style={styles.weatherText}>
             pressure: {weather.main.pressure}
          </Text>
        </View>
      )}
      <View style={styles.header}>
        <TouchableOpacity style={styles.button} onPress={fetchWeather}>
          <Text style={styles.buttonText}>Show Weather</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    
  },
  header: {
    position: 'absolute',
    top: 30,
    left: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  button: {
    backgroundColor: '#fff',
    top: 20,
    borderRadius: 10,
    borderWidth: 0.1,
    borderColor: '#ccc',
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginHorizontal: 10,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  weatherContainer: {
    position: 'absolute',
    top: 150,
    left: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 10,
    minWidth: 200,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginHorizontal: 45,
  },
  weatherText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#555',
  },
});

export default App;
