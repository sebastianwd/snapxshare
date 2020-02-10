import React, {useState} from 'react';
import {Alert, Button, StyleSheet, Text, View, Image} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import Share from 'react-native-share';
import RNFS from 'react-native-fs';

function getErrorString(error, defaultValue) {
  let e = defaultValue || 'Something went wrong. Please try again';
  if (typeof error === 'string') {
    e = error;
  } else if (error && error.message) {
    e = error.message;
  } else if (error && error.props) {
    e = error.props;
  }
  return e;
}

const App = () => {
  const [image, setImage] = useState();

  const shareToSnapchat = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images, DocumentPicker.types.video],
      });

      const data = await RNFS.readFile(res.uri, 'base64');

      const encoded = `data:${res.type};base64,${data}`;

      setImage(encoded);

      const shareOptions = {
        url: encoded,
        social: 'snapchat',
      };

      await Share.shareSingle(shareOptions);
    } catch (error) {
      console.warn(error);
      Alert.alert('', getErrorString(error));
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome to Snapchat image sharer</Text>
      <View style={styles.optionsRow}>
        <View style={styles.button}>
          <Button onPress={shareToSnapchat} title="Share to Snapchat" />
          {image && (
            <Image
              style={{height: 120, width: 120, marginTop: 40}}
              source={{uri: image}}
            />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    marginBottom: 10,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  textInput: {
    borderBottomColor: '#151313',
    borderBottomWidth: 1,
    marginRight: 10,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  resultTitle: {
    marginTop: 20,
    fontSize: 20,
  },
  result: {
    fontSize: 14,
    margin: 10,
  },
});

export default App;
