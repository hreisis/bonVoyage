import { ScrollView, Text } from "react-native";
import { Card, Button, Icon } from "react-native-elements";
import * as Animatable from 'react-native-animatable';
import * as MailComposer from 'expo-mail-composer';

const ContactScreen = () => {
    const sendMail = () => {
        MailComposer.composeAsync({
            recipients: ['info@livehouse.co'],
            subject: 'Inquiry',
            body:'To whom it may concerned:'
        });
    };

    return (
        <ScrollView>
            <Animatable.View
                animation='fadeInDown'
                duration={2000}
                delay={1000}
            >
            <Card wrapperStyle={{margin: 20}}>
                <Card.Title>Contact Information</Card.Title>
                    
                <Card.Divider />
                
                <Text>Please do not hesitate to contact us. Simply send us an email for any question you might have.</Text>
                <Button
                    title='Send Email'
                    buttonStyle={{ backgroundColor: '#16191f', margin: 40 }}
                    icon={
                        <Icon
                            name="envelope-o"
                            type="font-awesome"
                            color='#fff'
                            iconStyle={{ marginRight: 10 }}
                        />
                    }
                    onPress={() => sendMail()}
                />
            </Card>
        </Animatable.View>
        </ScrollView>
    )
};

export default ContactScreen;