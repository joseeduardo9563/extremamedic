import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import Base from '../../components/Base';
import {
    Spinner
} from 'native-base';
import HeaderGoBack from '../../components/HeaderGoBack';
import { useNavigation, useRoute } from '@react-navigation/native';

const IntermediaryScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('https://www.extremamedic.com');

    useEffect(() => {
        const titleParam = route.params?.title || '';
        const urlParam = route.params?.url || '';
        setTitle(titleParam);
        setUrl(urlParam);
        navigation.navigate('WebView', { title: titleParam, url: urlParam });
    }, [route.params]);

    return (
        <Base navigation={navigation}>
            <HeaderGoBack navigation={navigation} title={title} />
            <Spinner />
        </Base>
    );
};

export default IntermediaryScreen;