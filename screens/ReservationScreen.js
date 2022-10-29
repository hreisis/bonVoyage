import { useState } from 'react';
import { Text, View, ScrollView, StyleSheet, Switch, Button, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Animatable from 'react-native-animatable';
import * as Notifications from 'expo-notifications';

const ReservationScreen = () => {
    const [selections, setSelections] = useState(1);
    const [flexibleDate, setFlexibleDate] = useState(false);
    const [date, setDate] = useState(new Date());
    const [showCalendar, setShowCalendar] = useState(false);
    // const [showModal, setShowModal] = useState(false);

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowCalendar(Platform.OS === 'ios');
        setDate(currentDate);
    }

    const handleReservation = () => {
        console.log('selections:', selections);
        console.log('flexibleDate:', flexibleDate);
        console.log('date:', date);
        const message = `Number of Selections: + ${selections}
                        \nHike-in? ${flexibleDate}
                        \nDate: ${date.toLocaleDateString('en-US')}`;
        Alert.alert(
            'Begin Search?',
            message,
            [
                {
                    text: 'Cancel',
                    styles: 'cancel',
                    onPress: () => resetForm()
                },
                {
                    text: 'OK',
                    onPress: () => {
                        presentLocalNotification(
                            date.toLocaleDateString('en-US')
                        );
                        resetForm();
                    }
                }
            ]
        );
        // setShowModal(!showModal);
    };

    const resetForm = () => {
        setSelections(1);
        setFlexibleDate(false);
        setDate(new Date());
        setShowCalendar(false);
    }

    const presentLocalNotification = async (reservationDate) => {
        const sendNotification =() => {
            Notifications.setNotificationHandler({
                handleNotification: async () => ({
                    shouldShowAlert: true,
                    shouldPlaySound: true,
                    shouldSetBadge: true
                })
            })

            Notifications.scheduleNotificationAsync({
                content: {
                    title: 'Your Studio Reservation Search',
                    body: `Search for ${reservationDate} requested`
                },
                trigger: null //can set a specific date later
            })
        }

        let permissions = await Notifications.getPermissionsAsync(); //await is silmilar to then, in a async function
        if (!permissions.granted) {
            permissions = await Notifications.requestPermissionsAsync(); //doesn't have permission yet
        }
        if (permissions.granted) {
            sendNotification();
        }
    }
    //async always returns a promise

    return(
        <ScrollView>
            <Animatable.View
                animation='zoomIn'
                duration={2000}
                delay={1000}>
                <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Pick your studio</Text> 
                    <Picker
                        style={styles.formItem}
                        selectedValue={selections}
                        onValueChange={(itemValue) => setSelections(itemValue)}
                        >
                            <Picker.Item label='Studio 01' value={1} />
                            <Picker.Item label='Studio 02' value={2} />
                            <Picker.Item label='Pro 01' value={3} />
                            <Picker.Item label='Pro 02' value={4} />
                    </Picker>
                </View>
                <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Flexible Date?</Text>
                    <Switch 
                        style= {styles.formItem}
                        value={flexibleDate}
                        trackColor={{ true: '#16191f', false: null }}
                        onValueChange={(value) => setFlexibleDate(value)}
                    />
                </View>
                <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Date:</Text>
                    <Button
                        onPress={() => setShowCalendar(!showCalendar)}
                        title={date.toLocaleDateString('en-US')}
                        color='#16191f'
                        accessibilityLabel='Tap me to select a reservation date'
                    />
                </View>
                {showCalendar && (
                    <DateTimePicker
                        style={styles.formItem}
                        value={date}
                        mode='date'
                        display='default'
                        onChange={onDateChange}
                    />
                )}
                <View style={styles.formRow}>
                    <Button
                        onPress={() => handleReservation()}
                        title='Search Availability'
                        color='#101119'
                        accessibilityLabel='Tap me to search for available studios to reserve' />
                </View>
            </Animatable.View>
        </ScrollView>
    )
};

const styles = StyleSheet.create({
    formRow: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 2,
        flexDirection: 'row',
        margin: 20
    },
    formLabel: {
        fontSize: 18,
        flex: 2
    },
    formItem: {
        flex: 1
    }
});


export default ReservationScreen;