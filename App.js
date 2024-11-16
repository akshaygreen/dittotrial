import React, {useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  useColorScheme,
  View,
  Button,
} from 'react-native';

import {Colors, Header} from 'react-native/Libraries/NewAppScreen';
import {initializeDitto} from './utils/ditto/ditto.init';
import {requestPermissions} from './utils/permissions';
import {useDitto, DittoProvider} from './ditto.context';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const {
    createDocument,
    readAllDocuments,
    readDocumentById,
    updateDocument,
    deleteDocument,
    deleteAllDocuments,
  } = useDitto();

  useEffect(() => {
    // createDocument();
    // createDocument();
    // createDocument();
    // createDocument();
    // createDocument();
    // createDocument();
    readAllDocuments();
    // readDocumentById('123');
    // updateDocument('123', {color: 'green'});
    // deleteDocument('123');
    setTimeout(() => {
      deleteAllDocuments();
    }, 2000);
    // readAllDocuments();
  }, []);

  // useEffect(() => {
  //   // requestPermissions();
  //   // initializeDitto();
  // }, []);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Button title="Create Document" onPress={() => createDocument()} />
          <Button title="Read Documents" onPress={() => readAllDocuments()} />
          <Button
            title="Read Document by ID"
            onPress={() => readDocumentById('123')}
          />
          <Button
            title="Update Document"
            onPress={() => updateDocument('123', {color: 'green'})}
          />
          <Button
            title="Delete Document"
            onPress={() => deleteDocument('123')}
          />
          <Button
            title="Delete All Documents"
            onPress={() => deleteAllDocuments()}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const Root = ({ditto}) => (
  <DittoProvider ditto={ditto}>
    <App />
  </DittoProvider>
);

export default Root;
