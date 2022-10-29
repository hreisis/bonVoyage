import { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Image} from 'react-native';
import { CheckBox, Input, Button } from 'react-native-elements';
import * as SecureStore from 'expo-secure-store';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import * as ImagePicker from 'expo-image-picker';
import { baseUrl } from '../shared/baseUrl';
import logo from '../assets/images/logo.png';
import * as ImageManipulator from 'expo-image-manipulator';
import { SaveFormat } from 'expo-image-manipulator';
import * as MediaLibrary from 'expo-media-library';

const LoginTab = ( {navigation}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);

    const handleLogin = () => {
        console.log('username:', username);
        console.log('password:', password);
        console.log('remember:', remember);
        if (remember) {
            SecureStore.setItemAsync(
                'userinfo',
                JSON.stringify({
                    username,
                    password
                })
            ).catch((error) => console.log('Could not save user info', error));
        } else { 
            SecureStore.deleteItemAsync('userinfo').catch((error) =>
                console.log('Could not delete user info', error)
            )}
    };

    useEffect(() => { //check if the userinfo is in store, then return a promise that return the value
        SecureStore.getItemAsync('userinfo').then((userdata) => {
            const userinfo = JSON.parse(userdata);
            if (userinfo) {
                setUsername(userinfo.username);
                setPassword(userinfo.password);
                setRemember(true);
            }
        })
    }, []);

    return (
        <View style = {styles.container}>
            <Input 
                placeholder='Username'
                leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                onChangeText={(text) => setUsername(text)}
                value={username}
                containerStyle={styles.formInput}
                leftIconContainerStyle={styles.formIcon}
            />
            <Input 
                placeholder='Password'
                leftIcon={{ type: 'font-awesome', name: 'key' }}
                onChangeText={(text) => setPassword(text)}
                value={password}
                containerStyle={styles.formInput}
                leftIconContainerStyle={styles.formIcon}
            />
            <CheckBox
                title='Remember Me'
                center
                checked = {remember}
                onPress = {() => setRemember(!remember)}
                containerStyle={styles.formCheckbox}
            />
            <View style={styles.formButton}>
                <Button //Button in react-native-element is more advanced so it can use icon
                    onPress={() => handleLogin()}
                    title='Login'
                    color='#101119'
                    icon={
                        <Icon
                            name='sign-in'
                            type='font-awesome'
                            color='#fff'
                            iconStyle={{ marginRight: 10}}
                        />
                    }
                    buttonStyle={{ backgroundColor: '#16191f' }}
                />
            </View>
            <View style={styles.formButton}>
                <Button
                    onPress={() => navigation.navigate('Register')}
                    title='Register'
                    type='clear'
                    icon={
                        <Icon
                            name='user-plus'
                            type='font-awesome'
                            color='#16191f'
                            iconStyle={{ marginRight: 10}}
                        />
                    }
                    titleStyle={{ color: '#16191f' }}
                />
            </View>
        </View>
    )
};

const RegisterTab = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [remember, setRemember] = useState(false);
    const [imageUrl, setImageUrl] = useState(baseUrl + 'images/logo.png');

    const handleRegister = () => {
        const userinfo = {
            username,
            password,
            firstName,
            lastName,
            email,
            remember
        };

        if (remember) {
            SecureStore.setItemAsync(
                'userinfo',
                JSON.stringify({
                    username,
                    password
                })
            ).catch((error) => console.log('Could not save user info', error));
        } else { 
            SecureStore.deleteItemAsync('userinfo').catch((error) =>
                console.log('Could not delete user info', error)
            )}
    };

    const getImageFromCamera = async () => {
        const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
        if (cameraPermission.status === 'granted') {
            const capturedImage = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [1,1]
            }); 
            if (!capturedImage.cancelled) {
                //check if the image is not cancelled
                console.log(capturedImage);
                //setImageUrl(capturedImage.uri); //url: location uri: identifier
                processImage(capturedImage.uri);
                MediaLibrary.saveToLibraryAsync(capturedImage.uri);
            }
        }
    }

    const getImageFromGallery = async() => {
        const mediaLibraryPermissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (mediaLibraryPermissions.status === 'granted') {
            const capturedImage = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [1,1]
            });
            if (!capturedImage.cancelled) {
                console.log(capturedImage);
                processImage(capturedImage.uri);
            }
            
        }
    
    }

    const processImage = async(imgUri) => {
        const processedImage = await ImageManipulator.manipulateAsync(
            imgUri,
            [
                {resize: {
                height: 400, 
                width: 400
              }},
            ],
            { format: SaveFormat.PNG }
        );
        console.log(processedImage);
        setImageUrl(processedImage.uri);
    }

    return(<ScrollView>
        <View style = {styles.container}>
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: imageUrl }}
                    loadingIndicatorSource={logo}
                    style={styles.image}
                />
                <Button title='Camera' buttonStyle={{ backgroundColor: '#16191f' }} onPress={getImageFromCamera} />
                <Button title='Gallery' buttonStyle={{ backgroundColor: '#16191f' }} onPress={getImageFromGallery}/>
            </View>
            <Input 
                placeholder='Username'
                leftIcon={{ type: 'font-awesome', name: 'user-o'}}
                onChangeText={(text) => setUsername(text)}
                value={username}
                containerStyle={styles.formInput}
                leftIconContainerStyle={styles.formIcon}
            />
            <Input
                placeholder='Password'
                leftIcon={{ type: 'font-awesome', name: 'key' }}
                onChangeText={(text) => setPassword(text)}
                value={password}
                containerStyle={styles.formInput}
                leftIconContainerStyle={styles.formIcon}
            />
            <Input 
                placeholder='First Name'
                leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                onChangeText={(text) => setFirstName(text)}
                value={firstName}
                containerStyle={styles.formInput}
                leftIconContainerStyle={styles.formIcon}
            />
            <Input 
                placeholder='Last Name'
                leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                onChangeText={(text) => setLastName(text)}
                value={lastName}
                containerStyle={styles.formInput}
                leftIconContainerStyle={styles.formIcon}
            />
            <Input 
                placeholder='Email'
                leftIcon={{ type: 'font-awesome', name: 'envelope-o' }}
                onChangeText={(text) => setEmail(text)}
                value={email}
                containerStyle={styles.formInput}
                leftIconContainerStyle={styles.formIcon}
            />
            <CheckBox
                title='Remember Me'
                center
                checked = {remember}
                onPress = {() => setRemember(!remember)}
                containerStyle={styles.formCheckbox}
            />
            <View style={styles.formButton}>
                <Button //Button in react-native-element is more advanced so it can use icon
                    onPress={() => handleRegister()}
                    title='Register'
                    color='#3b3c51'
                    icon={
                        <Icon
                            name='user-plus'
                            type='font-awesome'
                            color='#fff'
                            iconStyle={{ marginRight: 10}}
                        />
                    }
                    buttonStyle={{ backgroundColor: '#16191f' }}
                />
            </View>
        </View>
    </ScrollView>)
};

const Tab = createBottomTabNavigator(); //returns an object contains navigator and screens

const LoginScreen =() => {
    const tabBarOptions ={
        activeBackgroundColor: '#16191f',
        inactiveBackgroundColor: '#3b3c51',
        activeTintColor: '#fff',
        inactiveTintColor: '#808080',
        labelStyle: { fontSize: 14}
    };

    return(
        <Tab.Navigator tabBarOptions={tabBarOptions}>
            <Tab.Screen
                name='Login'
                component={LoginTab}
                options={{
                    tabBarIcon: (props) =>{
                        return(
                            <Icon
                                name='sign-in'
                                type='font-awesome'
                                color={props.color} />
                        )
                    }
                }}
            />
            <Tab.Screen
                name='Register'
                component={RegisterTab}
                options={{
                    tabBarIcon: (props) =>{
                        return(
                            <Icon
                                name='user-plus'
                                type='font-awesome'
                                color={props.color} />
                        )
                    }
                }}
            />
            
        </Tab.Navigator>
    )
}



const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        margin: 10
    },
    formIcon: {
        marginRight: 10
    },
    formInput: {
        padding: 8,
        height: 60
    },
    formCheckbox: {
        margin: 8,
        backgroundColor: null
    },
    formButton: {
        margin: 20,
        marginRight:40,
        marginLeft: 40
    },
    imageContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems:'center',
        justifyContent:'space-evenly',
        margin: 10
    },
    image: {
        width: 60,
        height: 60
    }
})

export default LoginScreen;