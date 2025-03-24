import React, { Component } from 'react';
import { Linking, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { Container, Text, NativeBaseProvider } from 'native-base';
import { Button, Overlay } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import ColorsScheme from '../settings/ColorsScheme';
import Share from 'react-native-share';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MyFooter from './MyFooter';
import SideBar from './SiderBar';

const Drawer = createDrawerNavigator();

export default class Base extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      isVisibleIR: false
    };
  }

  openModal = () => this.setState({ isVisible: true });
  closeModal = () => this.setState({ isVisible: false });
  openModalIR = () => this.setState({ isVisibleIR: true });
  closeModalIR = () => this.setState({ isVisibleIR: false });

  render() {
    return (
      <NavigationContainer>
        <Drawer.Navigator
          drawerContent={(props) => (
            <SideBar {...props} openModal={this.openModal} openModalIR={this.openModalIR} />
          )}
        >
          <Drawer.Screen name="Main">
            {() => (
              <NativeBaseProvider>
                <View style={{ backgroundColor: '#f8f8f8' }}>
                  {this.props.children}
                  <MyFooter openModal={this.openModal} navigation={this.props.navigation} />
                </View>
              </NativeBaseProvider>
            )}
          </Drawer.Screen>
        </Drawer.Navigator>

        {/* Modal Imposto de Renda */}
        {/* <Overlay isVisible={this.state.isVisibleIR} onBackdropPress={this.closeModalIR}>
                <View style={{ padding: 20 }}>
                    <Text style={{ fontWeight: 'bold', color: '#444', textAlign: 'center', fontSize: 19 }}>
                        Imposto de Renda
                    </Text>
                    <Button
                        buttonStyle={{ margin: 10, backgroundColor: ColorsScheme.MAIN_COLOR, marginTop: 30, width: 200 }}
                        titleStyle={{ color: '#fff' }}
                        onPress={() => {
                            this.closeModalIR();
                            AsyncStorage.getItem('@usuario').then(val => {
                                if (val) {
                                    const usuario = JSON.parse(val);
                                    Linking.openURL(
                                        `http://serpram.com.br/app_json/Saude/IR/IRvisualizar.asp?matricula=${usuario.matricula}&autenticacao=${usuario.senha.substring(0,10)}&ano=${new Date().getFullYear() - 1}`
                                    );
                                }
                            });
                        }}
                        title="Abrir"
                    />
                </View>
            </Overlay> */}
      </NavigationContainer>
    );
  }
}
