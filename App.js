import { useEffect, useRef, useState } from "react";
import { Animated, ImageBackground, StyleSheet, Text, View } from "react-native";
import { Accelerometer } from 'expo-sensors';

const reponses = [
  'Oui',
  'Non',
  'Peut-être',
  'Définitevement',
  'Très probablement',
  'Impossible',
  'Pas d\'avis',
  'Peu probable',
  'Sans aucun doute',
  'Repose ta question',
  'C\'est bien parti'
]

export default function App() {
  const [reponse, setReponse] = useState("");
  const [shake, setShake] = useState(false);
  const [afficheReponse, setAfficheReponse] = useState(false);
  const fadeReponse = useRef(new Animated.Value(0)).current;

  const fadeIn = () => {
    Animated.timing(fadeReponse, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    Accelerometer.setUpdateInterval(50);
    Accelerometer.addListener(({ x, y, z }) => {
      if (shake) {
        return;
      }

      if (Math.abs(x) + Math.abs(y) + Math.abs(z) > 3) {
        setShake(true);
        fadeIn();
        setAfficheReponse(true);
        
        setReponse(reponses[Math.floor(Math.random() * reponses.length)]);

        setTimeout(() => {
          setShake(false);
        }, 5000);
      }
    });

    return () => {
      Accelerometer.removeAllListeners();
    };
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.titleLineOne}>Pensez à votre questions,</Text>
      <Text style={styles.titleLineTwo}>Secouez</Text>
      <ImageBackground
        style={styles.image}
        source={require("./assets/boule8-vide.jpg")}
        resizeMode="cover"
      >
        {afficheReponse && <Animated.View style={[styles.interieurBoule, {opacity: fadeReponse}]}>
          <Text style={styles.textBoule}>{reponse}</Text>
        </Animated.View>}
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  
  titleLineOne: {
    fontSize: 14,
    textTransform: "uppercase"
  },

  titleLineTwo: {
    fontSize: 24,
    textTransform: "uppercase",
    marginBottom: 32
  },

  image: {
    width: 250,
    height: 250,
    alignItems: "center",
    justifyContent: "center",
  },

  interieurBoule: {
    width: 105,
    height: 105,
    borderRadius: 100,
    backgroundColor: "#000070",
    alignItems: "center",
    justifyContent: "center",
  },

  textBoule: {
    textAlign: 'center',
    color: 'white'
  },
});
