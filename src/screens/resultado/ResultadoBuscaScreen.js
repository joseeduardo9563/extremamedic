import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Platform, ScrollView } from 'react-native';
import {
    Button,
    Spinner,
    Text,
    Card,
    CardItem,
    Body,
} from 'native-base';
import ColorsScheme from '../../settings/ColorsScheme';
import Base from '../../components/Base';
import HeaderGoBack from '../../components/HeaderGoBack';
import { useNavigation, useRoute } from '@react-navigation/native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const ResultadoBuscaScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const [data, setData] = useState([]);
    const [title, setTitle] = useState('Resultados');
    const [subTitle, setSubTitle] = useState('Abaixo os resultados da pesquisa');
    const [isolada, setIsolada] = useState(false);

    useEffect(() => {
        getData();
    }, [route.params]);

    const getData = () => {
        const receivedData = route.params?.data || [];
        const receivedTitle = route.params?.title || '';
        const receivedSubTitle = route.params?.subTitle || '';
        const receivedIsolada = route.params?.isolada || false;
        
        if (receivedData.length) {
            receivedData.forEach(item => {
                if (item.tipo === 'P' && !item.display) {
                    item.display = item.descricao.split(' ').pop().replace(')', ' ' + item.nconselho + ')');
                }
            });
            setData(receivedData);
            setTitle(receivedTitle);
            setSubTitle(receivedSubTitle);
            setIsolada(receivedIsolada);
        }
    };

    const openDetalhe = (item) => {
        navigation.navigate('ResultadoDetalhes', { data: item, isolada });
    };

    return (
        <Base navigation={navigation}>
            <HeaderGoBack navigation={navigation} title={'Rede Credenciada'} />
            <ScrollView style={styles.content}>
                <View style={styles.headerContainer}>
                    <Text style={{ fontSize: 22, fontWeight: "bold", textAlign: "center", padding: 10, color: ColorsScheme.ASENT_COLOR }}>
                        {title.toUpperCase()}
                    </Text>
                    <Text style={styles.subHeaderText}>{subTitle}</Text>
                </View>
                {data.length > 0 ? (
                    <Card>
                        {data.map((item, index) => (
                            <CardItem
                                key={index}
                                onPress={() => openDetalhe(item)}
                                button
                                bordered
                            >
                                <Body>
                                    <Text style={styles.itemTitle}>{item.tipo === 'P' ? item.Nome : isolada ? item.NOME : item.nome_empresa}</Text>
                                    <Text style={styles.itemText}>{isolada ? item.ESPECIALIDADE : item.especialidade}</Text>
                                </Body>
                            </CardItem>
                        ))}
                    </Card>
                ) : (
                    <View style={styles.noResultsContainer}>
                        <FontAwesome5 name="frown" size={130} color="#a0a0a0" />
                        <Text style={styles.noResultsText}>Ops.. não foi encontrado favoritos.</Text>
                    </View>
                )}
            </ScrollView>
        </Base>
    );
};

const styles = StyleSheet.create({
    content: { marginBottom: 55, marginHorizontal: 20, paddingBottom: 30, backgroundColor: '#f8f8f8' },
    headerContainer: { marginTop: 20, marginBottom: 20 },
    headerText: { fontWeight: 'bold', color: ColorsScheme.ASENT_COLOR },
    subHeaderText: { fontSize: 12 },
    itemTitle: { fontSize: 14, fontWeight: 'bold' },
    itemText: { fontSize: 14 },
    noResultsContainer: { marginTop: 30, alignItems: 'center', justifyContent: 'center', flex: Platform.OS === 'ios' ? undefined : 1 },
    noResultsText: { textAlign: 'center', marginTop: 10 }
});

export default ResultadoBuscaScreen;
