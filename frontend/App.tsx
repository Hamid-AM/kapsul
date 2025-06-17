import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import axios from 'axios';
import Mapbox from '@rnmapbox/maps'; // Import Mapbox

// IMPORTANT: Configure your backend API base URL here
// Android Emulator (running in WSL2) connecting to Docker on Windows Host
// Generally, 'http://10.0.2.2:3000' is the emulator's special alias for localhost
// OR if your Docker Compose is listening on a specific IP, use that.
// However, since Docker is running on your Windows host, and the emulator is effectively on Windows,
// 'http://localhost:3000' might also work if Docker is mapped to localhost.
// Let's stick with localhost, as Windows Docker usually bridges.
const API_BASE_URL = 'http://localhost:3000';

// IMPORTANT: Replace with your actual Mapbox Public Access Token
Mapbox.setAccessToken('MAPBOX_TOKEN');

const App = () => {
  const [backendStatus, setBackendStatus] = useState('Checking...');
  const [kapsulsFound, setKapsulsFound] = useState('...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkBackend = async () => {
      try {
        // Attempt to hit a health check or a simple API endpoint on your Rails backend
        const healthResponse = await axios.get(`${API_BASE_URL}/up`);
        if (healthResponse.status === 200) {
          setBackendStatus('Backend is UP! 🎉');
        } else {
          setBackendStatus(`Backend responded with status: ${healthResponse.status}`);
        }

        // Attempt to fetch some Kapsuls (assuming /api/v1/kapsuls exists and returns an array)
        const kapsulsResponse = await axios.get(`${API_BASE_URL}/api/v1/kapsuls`);
        if (kapsulsResponse.status === 200 && Array.isArray(kapsulsResponse.data)) {
          setKapsulsFound(`Found ${kapsulsResponse.data.length} kapsuls!`);
        } else {
          setKapsulsFound('Failed to fetch kapsuls or response format is unexpected.');
        }

      } catch (err) {
        console.error('Error connecting to backend:', err);
        if (axios.isAxiosError(err)) {
          if (err.code === 'ERR_NETWORK') {
            setError('Network error: Backend might not be running or accessible.');
          } else if (err.response) {
            setError(`Backend error: ${err.response.status} - ${err.response.statusText}`);
          } else {
            setError(`Request error: ${err.message}`);
          }
        } else {
          setError(`An unexpected error occurred: ${(err as Error).message}`);
        }
        setBackendStatus('Backend is DOWN or unreachable! ❌');
      }
    };

    checkBackend();
    const intervalId = setInterval(checkBackend, 5000); // Check every 5 seconds
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Kapsul Frontend Status</Text>
        {backendStatus === 'Checking...' && <ActivityIndicator size="large" color="#0000ff" />}
        <Text style={styles.statusText}>Backend status: {backendStatus}</Text>
        <Text style={styles.statusText}>Kapsuls found: {kapsulsFound}</Text>
        {error && <Text style={styles.errorText}>Error: {error}</Text>}
        <Text style={styles.infoText}>
          Ensure your Rails backend is running on {API_BASE_URL}
        </Text>
      </View>
      <View style={styles.mapContainer}>
        <Mapbox.MapView style={styles.map} zoomEnabled={true} scrollEnabled={true}>
          <Mapbox.Camera
            zoomLevel={10}
            centerCoordinate={[2.2945, 48.8584]} // Example: Eiffel Tower coordinates
            animationMode="flyTo"
            animationDuration={0}
          />
          <Mapbox.PointAnnotation
              id="eiffelTower"
              coordinate={[2.2945, 48.8584]}
          >
              <View style={styles.annotationContainer}>
                  <Text style={styles.annotationText}>📍</Text>
              </View>
          </Mapbox.PointAnnotation>
        </Mapbox.MapView>
        <Text style={styles.mapStatusText}>Mapbox map should be visible above.</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  statusText: {
    fontSize: 18,
    marginVertical: 5,
    color: '#555',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 14,
    marginTop: 30,
    color: '#777',
    textAlign: 'center',
  },
  mapContainer: {
    flex: 1,
    width: '100%',
    height: 300, // Fixed height for the map
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  mapStatusText: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
  annotationContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  annotationText: {
    fontSize: 20,
    color: 'blue',
  },
});

export default App;