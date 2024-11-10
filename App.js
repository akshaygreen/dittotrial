import React, { useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  PermissionsAndroid,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import { Ditto, DittoError, TransportConfig } from '@dittolive/ditto';
import { Platform } from 'react-native';
import RNFS from 'react-native-fs'; // Import React Native File System

function Section({ children, title }) {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}
      >
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}
      >
        {children}
      </Text>
    </View>
  );
}

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  async function initializeDitto() {
    const identity = {
      type: 'onlinePlayground',
      appID: 'd5db163a-0300-4708-8fc4-581233a7d42e',
      token: 'f2478881-673e-4bc7-be76-8921cdcbaf10',
    };

    try {
      const ditto = new Ditto(identity);

      const transportsConfig = new TransportConfig();
      transportsConfig.peerToPeer.bluetoothLE.isEnabled = true;
      transportsConfig.peerToPeer.lan.isEnabled = true;
      transportsConfig.peerToPeer.lan.isMdnsEnabled = true;

      if (Platform.OS === 'ios') {
        transportsConfig.peerToPeer.awdl.isEnabled = true;
      }

      ditto.setTransportConfig(transportsConfig);
      ditto.startSync();

      // Example CRUD operations
      await createDocument(ditto);
      await createMultipleDocuments(ditto);
      await createDocumentWithCustomID(ditto);
      await createDocumentWithCompositeKey(ditto);
      await createAttachment(ditto);

    } catch (error) {
      if (error instanceof DittoError) {
        console.error('Ditto initialization error:', error);
      } else {
        throw error;
      }
    }
  }

  async function requestPermissions() {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
        PermissionsAndroid.PERMISSIONS.NEARBY_WIFI_DEVICES,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      ]);

      Object.entries(granted).forEach(([permission, result]) => {
        console.log(
          `${permission} ${
            result === PermissionsAndroid.RESULTS.GRANTED ? 'granted' : 'denied'
          }`,
        );
      });
    }
  }

  useEffect(() => {
    requestPermissions();
    initializeDitto();
  }, []);

  async function createDocument(ditto) {
    const result = await ditto.store.execute(
      "INSERT INTO cars DOCUMENTS (:newCar)",
      { newCar: { color: 'blue' } }
    );
    console.log(result.mutatedDocumentIDs.first);
  }

  async function createMultipleDocuments(ditto) {
    const result = await ditto.store.execute(
      "INSERT INTO cars DOCUMENTS (:doc1),(:doc2)",
      {
        doc1: { color: 'blue' },
        doc2: { color: 'red' },
      }
    );
    console.log(result.mutatedDocumentIDs);
  }

  async function createDocumentWithCustomID(ditto) {
    const result = await ditto.store.execute(
      "INSERT INTO cars DOCUMENTS (:newCar) ON ID CONFLICT DO UPDATE",
      { newCar: { _id: '123', color: 'blue' } }
    );
    console.log(result.mutatedDocumentIDs.first);
  }

  async function createDocumentWithCompositeKey(ditto) {
    const result = await ditto.store.execute(
      "INSERT INTO cars DOCUMENTS (:newCar) ON ID CONFLICT DO UPDATE",
      {
        newCar: {
          _id: { vin: '123', make: 'Toyota' },
          color: 'blue',
        },
      }
    );
    console.log(result.mutatedDocumentIDs.first);
  }

  async function createAttachment(ditto) {
    const filePathOrData = RNFS.DocumentDirectoryPath + '/test.txt'; // Replace with actual file path or data
    const fileExists = await RNFS.exists(filePathOrData);

    if (!fileExists) {
      console.log('File does not exist, creating file:', filePathOrData);
      await RNFS.writeFile(filePathOrData, 'This is a test file.', 'utf8');
    }

    try {
      const newAttachment = await ditto.store.newAttachment(filePathOrData);

      const result = await ditto.store.execute(
        "INSERT INTO cars DOCUMENTS (:newCar)",
        {
          newCar: {
            color: 'blue',
            attachment: newAttachment.token,
          },
        }
      );
      console.log(result.mutatedDocumentIDs.first);
    } catch (error) {
      console.error('Error creating attachment:', error);
    }
  }

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}
      >
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}
        >
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.tsx</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;