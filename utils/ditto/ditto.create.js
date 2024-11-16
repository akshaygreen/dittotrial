async function createDocument(ditto) {
  try {
    const newPhone = {
      brand: 'Apple',
      model: 'iPhone 13',
    };

    const result = await ditto.store.execute(
      'INSERT INTO phones DOCUMENTS (:newPhone)',
      {newPhone},
    );

    // Retrieve the document ID
    console.log(result.mutatedDocumentIDs()[0].value);
  } catch (error) {
    console.error('Error creating document:', error);
  }
}

async function readDocuments(ditto) {
  try {
    const result = await ditto.store.execute('SELECT * FROM phones');
    result.items.forEach(item => {
      const itemValue = item.value;
      console.log(itemValue);
    });
  } catch (error) {
    console.error('Error reading documents:', error);
  }
}

async function updateDocument(ditto, documentId, updatedFields) {
  try {
    const setClause = Object.keys(updatedFields)
      .map(key => `${key} = :${key}`)
      .join(', ');

    const result = await ditto.store.execute(
      `UPDATE phones SET ${setClause} WHERE _id = :documentId`,
      {...updatedFields, documentId},
    );

    console.log('Updated document IDs:', result.mutatedDocumentIDs().value);
  } catch (error) {
    console.error('Error updating document:', error);
  }
}

async function deleteDocument(ditto, documentId) {
  try {
    await ditto.store.execute(`EVICT FROM phones WHERE _id = :documentId`, {
      documentId,
    });
    console.log(`Document with ID ${documentId} has been evicted.`);
  } catch (error) {
    console.error('Error deleting document:', error);
  }
}

async function deleteAllDocuments(ditto) {
  try {
    const result = await ditto.store.execute('EVICT FROM phones');
    console.log('All documents have been evicted.');
  } catch (error) {
    console.error('Error deleting all documents:', error);
  }
}

export {
  createDocument,
  readDocuments,
  updateDocument,
  deleteDocument,
  deleteAllDocuments,
};
