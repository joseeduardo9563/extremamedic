import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome5';

export default class FavoriteButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ativado: false,
            favoritos: []
        };
    }

    componentDidMount() {
        this._retrieveData();
    }

    _retrieveData = async () => {
        try {
            const value = await AsyncStorage.getItem('Favoritos');
            if (value !== null) {
                let arr = JSON.parse(value);
                let achei = arr.find(
                    obj =>
                        (obj.tipo === 'P' && obj.profissional === this.props.data.profissional) ||
                        (obj.tipo === 'J' &&
                            obj.NOME === this.props.data.NOME &&
                            obj.ESPECIALIDADE === this.props.data.ESPECIALIDADE &&
                            obj.FONE_COML === this.props.data.FONE_COML)
                );
                this.setState({ favoritos: arr, ativado: !!achei });
            }
        } catch (error) {
            console.error("Erro ao recuperar dados", error);
        }
    };

    _storeData = async (store) => {
        try {
            await AsyncStorage.setItem('Favoritos', JSON.stringify(store));
        } catch (error) {
            console.error("Erro ao salvar dados", error);
        }
    };

    salvardados = () => {
        this.setState(prevState => {
            const ativado = !prevState.ativado;
            let favoritos = [...prevState.favoritos];

            if (ativado) {
                favoritos.push(this.props.data);
            } else {
                favoritos = favoritos.filter(obj => {
                    if (this.props.data.tipo === 'P') {
                        return obj.profissional !== this.props.data.profissional;
                    }
                    return obj.NOME !== this.props.data.NOME ||
                           obj.ESPECIALIDADE !== this.props.data.ESPECIALIDADE ||
                           obj.FONE_COML !== this.props.data.FONE_COML;
                });
            }

            this._storeData(favoritos);
            return { ativado, favoritos };
        });
    };

    render() {
        return (
            <TouchableOpacity onPress={this.salvardados}>
                <Icon
                    name={'heart'}
                    solid={this.state.ativado}
                    style={{ fontSize: 20, color: '#000040' }}
                />
            </TouchableOpacity>
        );
    }
}