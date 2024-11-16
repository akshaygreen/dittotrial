import {Platform} from 'react-native';
import {Ditto, DittoError, TransportConfig} from '@dittolive/ditto';
import {
  createDocument,
  deleteAllDocuments,
  deleteDocument,
  readDocuments,
  updateDocument,
} from './ditto.create';

const identity = {
  type: 'onlinePlayground',
  appID: '2e0dc36b-e9b2-4bd8-86fd-1f5c9c2bc753',
  token: '8fee3d71-e4e1-452d-80af-55b907fd0d4a',
};
const ditto = new Ditto(identity);

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

    await createDocument(ditto);
    await readDocuments(ditto);
    await updateDocument(ditto, '6730bd2000263145004e6cd4', {
      model: 'iPhone 13 Pro',
    });
    await deleteDocument(ditto, '6730bd2000263145004e6cd4');
    await readDocuments(ditto);
    await deleteAllDocuments(ditto);
    await readDocuments(ditto);
  } catch (error) {
    if (error instanceof DittoError) {
      console.error('Ditto initialization error:', error);
    } else {
      throw error;
    }
  }
}

export {initializeDitto};
