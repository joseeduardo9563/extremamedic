import React from 'react';
import { NavigationContainer  } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoadingScreen from './src/screens/login/LoadingScreen';
import SelectScreen from './src/screens/login/SelectScreen';
import HomeScreen from './src/screens/home/HomeScreen';
import SelectIsoladaScreen from './src/screens/isolada/SelectIsoladaScreen';
import EscolhaIsoladaScreen from './src/screens/isolada/EscolhaIsoladaScreen';
import ResultadoBuscaScreen from './src/screens/resultado/ResultadoBuscaScreen';
import ResultadoDetalhesScreen from './src/screens/resultado/ResultadoDetalhesScreen';
import SelectCombinadaScreen from './src/screens/combinada/SelectCombinadaScreeen';
import ContatoScreens from './src/screens/contato/ContatoScreens';
import WebViewScreen from './src/screens/webview/WebViewScreen';
import IntermediaryScreen from './src/screens/webview/IntermediaryScreen';
import LoginScreen from './src/screens/login/LoginScreen';
import PerfilScreen from './src/screens/login/PerfilScreen';
import RecuperarSenhaScreen from './src/screens/login/RecuperarSenhaScreen';
import AboutScreen from './src/screens/About/AboutScreen';
import PrimeiroAcessoScreen from './src/screens/primeiroAcesso/PrimeiroAcessoScreen';
import PrimeiroAcesso_doisScreen from './src/screens/primeiroAcesso/primeiroAcesso_doisScreen';
import FinanceiroScreen from './src/screens/finaceiro/FinanceiroScreen';
import AlterarSenhaScreen from './src/screens/trocarSenha/AlterarSenhaScreen';
import AlterarSenha_DoisScreen from './src/screens/trocarSenha/AlterarSenha_DoisScreen';
import ContratoScreen from './src/screens/finaceiro/ContratoScreen';
import UtilizacoesScreen from './src/screens/finaceiro/UtilizacoesScreen';
import Utilizacoes2Screen from './src/screens/finaceiro/Utilizacoes2Screen';
import CarteirinhaScreen from './src/screens/carteirinha/CarteirinhaScreen';
import Carteirinha_2Screen from './src/screens/carteirinha/Carteirinha_2Screen';
import ConfirmaScreen from './src/screens/primeiroAcesso/ConfirmaScreen';
import SenhaScreen from './src/screens/primeiroAcesso/SenhaScreen';
import Confirma_notFoundScreen from './src/screens/primeiroAcesso/Confirma_notFoundScreen';
import CoparticipacaoScreen from './src/screens/coparticipacao/CoparticipacaoScreen';
import ResultCopartScreen from './src/screens/coparticipacao/ResultCopartScreen';
import TermosScreen from './src/screens/termos/TermosScreen';
import { NativeBaseProvider } from 'native-base';

export type RootStackParamList = {
  Loading: undefined;
  SelectIsolada: undefined;
  Perfil: undefined;
  Login: undefined;
  Home: undefined;
  Intermediary: undefined;
  Select: undefined;
  Contato: undefined;
  WebView: undefined;
  EscolhaIsolada: undefined;
  ResultadoBusca: undefined;
  ResultadoDetalhes: undefined;
  SelectCombinada: undefined;
  RecuperarSenha: undefined;
  About: undefined;
  PrimeiroAcesso: undefined;
  Senha: undefined;
  PrimeiroAcesso_dois: undefined;
  Financeiro: undefined;
  AlterarSenha: undefined;
  AlterarSenhaDois: undefined;
  Contrato: undefined;
  Utilizacoes: undefined;
  Utilizacoes2: undefined;
  Carteirinha: undefined;
  Carteirinha_2: undefined;
  Confirma: undefined;
  Confirma_notFound: undefined;
  Coparticipacao: undefined;
  ResultCopart: undefined;
  Termos: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Loading" component={LoadingScreen} />
          <Stack.Screen name="SelectIsolada" component={SelectIsoladaScreen} />
          <Stack.Screen name="Perfil" component={PerfilScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Intermediary" component={IntermediaryScreen} />
          <Stack.Screen name="Select" component={SelectScreen} />
          <Stack.Screen name="Contato" component={ContatoScreens} />
          <Stack.Screen name="WebView" component={WebViewScreen} />
          <Stack.Screen name="EscolhaIsolada" component={EscolhaIsoladaScreen} />
          <Stack.Screen name="ResultadoBusca" component={ResultadoBuscaScreen} />
          <Stack.Screen name="ResultadoDetalhes" component={ResultadoDetalhesScreen} />
          <Stack.Screen name="SelectCombinada" component={SelectCombinadaScreen} />
          <Stack.Screen name="RecuperarSenha" component={RecuperarSenhaScreen} />
          <Stack.Screen name="About" component={AboutScreen} />
          <Stack.Screen name="PrimeiroAcesso" component={PrimeiroAcessoScreen} />
          <Stack.Screen name="Senha" component={SenhaScreen} />
          <Stack.Screen name="PrimeiroAcesso_dois" component={PrimeiroAcesso_doisScreen} />
          <Stack.Screen name="Financeiro" component={FinanceiroScreen} />
          <Stack.Screen name="AlterarSenha" component={AlterarSenhaScreen} />
          <Stack.Screen name="AlterarSenhaDois" component={AlterarSenha_DoisScreen} />
          <Stack.Screen name="Contrato" component={ContratoScreen} />
          <Stack.Screen name="Utilizacoes" component={UtilizacoesScreen} />
          <Stack.Screen name="Utilizacoes2" component={Utilizacoes2Screen} />
          <Stack.Screen name="Carteirinha" component={CarteirinhaScreen} />
          <Stack.Screen name="Carteirinha_2" component={Carteirinha_2Screen} />
          <Stack.Screen name="Confirma" component={ConfirmaScreen} />
          <Stack.Screen name="Confirma_notFound" component={Confirma_notFoundScreen} />
          <Stack.Screen name="Coparticipacao" component={CoparticipacaoScreen} />
          <Stack.Screen name="ResultCopart" component={ResultCopartScreen} />
          <Stack.Screen name="Termos" component={TermosScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
};

export default App;