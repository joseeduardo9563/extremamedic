import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import Base from '../../components/Base';
import HeaderGoBack from '../../components/HeaderGoBack';
import { WebView } from 'react-native-webview';
import { useNavigation, useRoute } from '@react-navigation/native';

const WebViewScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('https://www.extremamedic.com');

    useEffect(() => {
        const titleParam = route.params?.title || '';
        const urlParam = route.params?.url || '';
        setTitle(titleParam);
        setUrl(urlParam);
    }, [route.params]);

    return (
        <Base navigation={navigation}>
            <HeaderGoBack navigation={navigation} title={title} />
            <WebView source={{ uri: url }} style={styles.webview} />
        </Base>
    );
};

const styles = StyleSheet.create({
    webview: { flex: 1, marginBottom: 55 }
});

export default WebViewScreen;