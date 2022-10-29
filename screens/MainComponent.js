import { Platform, View, StyleSheet, Image, Text, Alert, ToastAndroid } from 'react-native';
import Constants from 'expo-constants';
import StudioInfoScreen from './StudioInfoScreen';
import DirectoryScreen from './DirectoryScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import HomeScreen from './HomeScreen';
import ContactScreen from './ContactScreen';
import ReservationScreen from './ReservationScreen';
import { Icon } from 'react-native-elements';
import logo from '../assets/images/logo.png';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { fetchStudios } from '../features/studios/studiosSlice';
import { fetchPromotions } from '../features/promotions/promotionsSlice';
import { fetchComments } from '../features/comments/commentsSlice';
import FavouritesScreen from './FavouritesScreen';
import LoginScreen from './LoginScreen';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';

const Drawer = createDrawerNavigator();

const screenOptions = {
    headerTintColor: '#e0ce99',
    headerStyle: { backgroundColor: '#12151a' }
};

const ContactNavigator =() => {
    const Stack =createStackNavigator();
    return (
        <Stack.Navigator screenOptions={screenOptions}>
            <Stack.Screen 
                name='Contact'
                component={ContactScreen}
                options={({ navigation })=>({ 
                    title: 'Contact Us',
                    headerLeft: () => (
                        <Icon 
                            name='address-card'
                            type='font-awesome'
                            iconStyle={styles.stackIcon}
                            onPress = {() => navigation.toggleDrawer()} />
                    )
                })}
            />
        </Stack.Navigator>
    )
}

const ReservationNavigator = () => {
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator screenOptions={screenOptions}>
            <Stack.Screen
                name='Reservation'
                component={ReservationScreen}
                options={({ navigation }) => ({
                    title: 'Reservation Search',
                    headerLeft: () => (
                        <Icon
                            name='tree'
                            type='font-awesome'
                            iconStyle={styles.stackIcon}
                            onPress={() => navigation.toggleDrawer()}
                        />
                    )
                })}
            />
        </Stack.Navigator>
    );
};

const FavouritesNavigator = () => {
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator screenOptions={screenOptions}>
            <Stack.Screen
                name='Favourites'
                component={FavouritesScreen}
                options={({ navigation }) => ({
                    title: 'Favourite Studios',
                    headerLeft: () => (
                        <Icon
                            name='heart'
                            type='font-awesome'
                            iconStyle={styles.stackIcon}
                            onPress={() => navigation.toggleDrawer()}
                        />
                    )
                })}
            />
        </Stack.Navigator>
    );
};

const LoginNavigator = () => {
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator screenOptions={screenOptions}>
            <Stack.Screen
                name='Login'
                component={LoginScreen}
                options={({ navigation, route }) => ({
                    headerTitle: getFocusedRouteNameFromRoute(route),
                    headerLeft: () => (
                        <Icon
                            name={
                                getFocusedRouteNameFromRoute(route) ===
                                'Register'
                                    ? 'user-plus'
                                    : 'sign-in'
                            }
                            type='font-awesome'
                            iconStyle={styles.stackIcon}
                            onPress={() => navigation.toggleDrawer()}
                        />
                    )
                })}
            />
        </Stack.Navigator>
    );
};

const HomeNavigator = () => {
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator screenOptions={screenOptions}>
            <Stack.Screen
                name='Home'
                component={HomeScreen}
                options={({ navigation })=>({ 
                    title: 'Home',
                    headerLeft: () => (
                        <Icon 
                            name='home'
                            type='font-awesome'
                            iconStyle={styles.stackIcon}
                            onPress = {() => navigation.toggleDrawer()} />
                    )
                })}
            />
        </Stack.Navigator>
    );
};

const DirectoryNavigator = () => {
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator
            initialRouteName='Directory'
            screenOptions={screenOptions}
        >
            <Stack.Screen
                name='Directory'
                component={DirectoryScreen}
                options={({ navigation })=>({ 
                    title: 'Studio Directory',
                    headerLeft: () => (
                        <Icon 
                            name='list'
                            type='font-awesome'
                            iconStyle={styles.stackIcon}
                            onPress = {() => navigation.toggleDrawer()} />
                    )
                })}
            />
            <Stack.Screen
                name='StudioInfo'
                component={StudioInfoScreen}
                options={({ route }) => ({
                    title: route.params.studio.name
                })}
            />
        </Stack.Navigator>
    );
};

const CustomDrawerContent =(props) => (
    <DrawerContentScrollView {...props}>
        <View style={styles.drawerHeader}>
            <View style={{ flex: 1 }}>
                <Image source={logo} style={styles.drawerImage} />
            </View>
            <View style={{ flex: 1 }}>
                <Text style={styles.drawerHeaderText}>PIRATES</Text>
            </View>
        </View>
        <DrawerItemList {...props} labelStyle={{ fontWeight: 'bold'}} style={{activeBackgroundColor: '#16191f'}} />
    </DrawerContentScrollView>
)

const Main = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchStudios());
        dispatch(fetchPromotions());
        dispatch(fetchComments());
    }, [dispatch]);

    useEffect(() => {
        showNetInfo();

        const unsubscribeNetInfo = NetInfo.addEventListener(
            (connectionInfo) => {
                handleConnectivityChange(connectionInfo);
            }
        );

        return unsubscribeNetInfo;
    }, []);

    const showNetInfo = async () => {
        const connectionInfo = await NetInfo.fetch();
        Platform.OS === 'ios'
            ? Alert.alert(
                  'Initial Network Connectivity Type:',
                  connectionInfo.type
              )
            : ToastAndroid.show(
                  'Initial Network Connectivity Type: ' + connectionInfo.type,
                  ToastAndroid.LONG
              );
    };

    const handleConnectivityChange =(connectionInfo) => {
        let connectionMsg = 'You are now connected to an active network.';

        switch (connectionInfo.type) {
            case 'none':
                connectionMsg = 'No network connection is active.';
                break;
            case 'unknown':
                connectionMsg = 'The network connection state is now unknown.';
                break;
            case 'cellular':
                connectionMsg = 'You are now connected to a cellular network.';
                break;
            case 'wifi':
                connectionMsg = 'You are now connected to WiFi network.';
                break;
        }
        Platform.OS === 'ios'
            ? Alert.alert('Connection change:', connectionMsg)
            : ToastAndroid.show(connectionMsg, ToastAndroid.LONG);
    }

    return (
        <View
            style={{
                flex: 1,
                paddingTop:
                    Platform.OS === 'ios' ? 0 : Constants.statusBarHeight
            }}
        >
            <Drawer.Navigator            
                initialRouteName='Home' //page we first open up the app
                drawerContent={CustomDrawerContent}
                drawerStyle={{ backgroundColor: '#e3d099' }}
                activeBackgroundColor='#16191f'
                activeTintColor = '#16191f'
            >
                <Drawer.Screen
                    name='Login'
                    component={LoginNavigator}
                    options={{ 
                        drawerIcon: ({ color }) => (
                            <Icon
                                name='sign-in'
                                type='font-awesome'
                                size={24}
                                iconStyle={{ width: 24}}
                                color={color} />
                        ) 
                    }}
                />
                <Drawer.Screen
                    name='Home'
                    component={HomeNavigator}
                    options={{ 
                        title: 'Home',
                        drawerIcon: ({ color }) => (
                            <Icon
                                name='home'
                                type='font-awesome'
                                size={24}
                                iconStyle={{ width: 24}}
                                color={color} />
                        ) 
                    }}
                />
                <Drawer.Screen
                    name='Directory'
                    component={DirectoryNavigator}
                    options={{ title: 'Studio Directory',
                        drawerIcon: ({ color }) => (
                            <Icon
                                name='list'
                                type='font-awesome'
                                size={24}
                                iconStyle={{ width: 24}}
                                color={color} />
                        )  }}
                />

                <Drawer.Screen
                    name='ReserveStudio'
                    component={ReservationNavigator}
                    options={{
                        title: 'Reserve Studio',
                        drawerIcon: ({ color }) => (
                            <Icon
                                name='tree'
                                type='font-awesome'
                                size={24}
                                iconStyle={{ width: 24 }}
                                color={color}
                            />
                        )
                    }}
                />

                <Drawer.Screen
                    name='Favourites'
                    component={FavouritesNavigator}
                    options={{
                        title: 'My Favourites',
                        drawerIcon: ({ color }) => (
                            <Icon
                                name='heart'
                                type='font-awesome'
                                size={24}
                                iconStyle={{ width: 24 }}
                                color={color}
                            />
                        )
                    }}
                />
                <Drawer.Screen 
                    name='Contact'
                    component={ContactNavigator}
                    options={{ title:'Contact Us',
                        drawerIcon: ({ color }) => (
                            <Icon
                                name='address-card'
                                type='font-awesome'
                                size={24}
                                iconStyle={{ width: 24}}
                                color={color} />
                        )  }}
                />
            </Drawer.Navigator>
        </View>
    );
};

const styles = StyleSheet.create({
    drawerHeader: {
        backgroundColor: '#12151a',
        height: 140,
        alignItems: 'center',
        justifyContent:'center',
        flex: 1,
        flexDirection:'row'
    },
    drawerHeaderText: {
        color: '#e0ce99',
        fontSize: 24,
        fontWeight: 'bold'
    },
    drawerImage: {
        margin: 10,
        height: 80,
        width: 80
    },
    stackIcon: {
        marginLeft: 10,
        color: '#e0ce99',
        fontSize: 24
    }
});

export default Main;