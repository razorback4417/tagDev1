import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Image, StyleSheet, Animated } from 'react-native';

import { LogBox } from 'react-native';

LogBox.ignoreLogs(['@firebase/auth']);

export default function LoadingScreen() {
    const [fadeAnim] = useState(new Animated.Value(0));  // Initial value for opacity: 0
    const [typewriterText, setTypewriterText] = useState('');

    useEffect(() => {
        Animated.timing(
            fadeAnim,
            {
                toValue: 1,
                duration: 2000,
                useNativeDriver: false
            }
        ).start();

        let text = '$6,800 saved...';
        let i = 0;
        let typing = setInterval(() => {
            if (i < text.length) {
                setTypewriterText((prevText) => prevText + text[i]);
                i++;
            } else {
                clearInterval(typing);
            }
        }, 150);
    }, []);

    return (
        <View style={styles.container}>
            <Animated.Image
                // source={{uri: 'https://media.tenor.com/YcFSe6beXXMAAAAi/pacrun-pacman.gif'}}
                //
                source={{uri: 'https://i.ibb.co/hFKfWJ8/tagLogo.png'}}
                style={{...styles.logo, opacity: fadeAnim}}

            />
            <ActivityIndicator size="large" color="#000000" />
            <Animated.Text style={{
                fontSize: 50,
                fontWeight: 'bold',
                opacity: fadeAnim  // Bind opacity to animated value
            }}>
                TAG BETA
            </Animated.Text>
            <Text style={styles.loadingText}>{typewriterText}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    logo: {
        width: 200,
        height: 200,
        marginBottom: 50,
    },
    loadingText: {
        marginTop: 20,
        fontSize: 18,
    },
});