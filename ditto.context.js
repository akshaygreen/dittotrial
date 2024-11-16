import React, {createContext, useContext, useEffect, useState} from 'react';
import {Platform} from 'react-native';
import {Ditto, DittoError, TransportConfig} from '@dittolive/ditto';

const DittoContext = createContext();

export const useDitto = () => useContext(DittoContext);

export const DittoProvider = ({children}) => {
  const [items, setItems] = useState([]);

  const identity = {
    type: 'onlinePlayground', // real business use, real time connection with the database
    appID: '2e0dc36b-e9b2-4bd8-86fd-1f5c9c2bc753',
    token: '8fee3d71-e4e1-452d-80af-55b907fd0d4a', // authentication modes
  };
  const ditto = new Ditto(identity);

  const createDocument = async () => {
    try {
      // random integer between 0 and 1000000
      const randomId = Math.floor(Math.random() * 1000000);
      const newPhone = {
        name: 'huhuhuhuhu' + randomId,
      };

      const result = await ditto.store.execute(
        'INSERT INTO huhuhu DOCUMENTS (:newPhone)',
        {newPhone},
      );

      // Retrieve the document ID
      console.log(result.mutatedDocumentIDs()[0].value);
    } catch (error) {
      console.error('Error creating document:', error);
    }
  };

  const readAllDocuments = async () => {
    try {
      const result = await ditto.store.execute('SELECT * FROM huhuhu');
      result.items.forEach(item => {
        const itemValue = item.value;
        console.log(itemValue);
      });

      setItems(result.items);
    } catch (error) {
      console.error('Error reading documents:', error);
    }
  };

  const readDocumentById = async documentId => {
    try {
      const result = await ditto.store.execute(
        'SELECT * FROM huhuhu WHERE _id = :documentId',
        {documentId},
      );
      if (result.items.length > 0) {
        const itemValue = result.items[0].value;
        console.log(itemValue);
      } else {
        console.log(`Document with ID ${documentId} not found.`);
      }
    } catch (error) {
      console.error('Error reading document by ID:', error);
    }
  };

  const updateDocument = async (documentId, updatedFields) => {
    try {
      const setClause = Object.keys(updatedFields)
        .map(key => `${key} = :${key}`)
        .join(', ');

      const result = await ditto.store.execute(
        `UPDATE huhuhu SET ${setClause} WHERE _id = :documentId`,
        {...updatedFields, documentId},
      );

      console.log('Updated document IDs:', result.mutatedDocumentIDs().value);
    } catch (error) {
      console.error('Error updating document:', error);
    }
  };

  const deleteDocument = async documentId => {
    try {
      await ditto.store.execute(`EVICT FROM huhuhu WHERE _id = :documentId`, {
        documentId,
      });
      console.log(`Document with ID ${documentId} has been evicted.`);
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  const deleteAllDocuments = async () => {
    try {
      // const result = await ditto.store.execute('EVICT FROM huhuhu');
      items.forEach(async item => {
        const result = await ditto.store.execute(
          `EVICT FROM huhuhu WHERE _id = :documentId`,
          {
            documentId: item._id,
          },
        );
        console.log(result, item._id);
      });
      console.log('All documents have been evicted.');
    } catch (error) {
      console.error('Error deleting all documents:', error);
    }
  };

  async function initializeDitto() {
    try {
      const transportsConfig = new TransportConfig();
      transportsConfig.peerToPeer.bluetoothLE.isEnabled = true;
      transportsConfig.peerToPeer.lan.isEnabled = true;
      transportsConfig.peerToPeer.lan.isMdnsEnabled = true;

      if (Platform.OS === 'ios') {
        transportsConfig.peerToPeer.awdl.isEnabled = true;
      }

      ditto.setTransportConfig(transportsConfig);
      ditto.startSync();
    } catch (error) {
      if (error instanceof DittoError) {
        console.error('Ditto initialization error:', error);
      } else {
        throw error;
      }
    }
  }

  useEffect(() => {
    initializeDitto();
  }, []);

  return (
    <DittoContext.Provider
      value={{
        createDocument,
        readAllDocuments,
        readDocumentById,
        updateDocument,
        deleteDocument,
        deleteAllDocuments,
      }}>
      {children}
    </DittoContext.Provider>
  );
};
