import { StyleSheet, Text, View, PanResponder, Alert} from 'react-native';
import { Card, Icon } from 'react-native-elements';
import { baseUrl } from '../../shared/baseUrl';
import * as Animatable from 'react-native-animatable';
import { favouritesReducer } from '../favourites/favouriteSlice';

const RenderCampsite = (props) => {
    const { campsite } = props;

    const isLeftSwipe = ({ dx }) => dx < -200; //dx means delta x, how far it moves along x axis

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: ()=> true,
        onPanResponderEnd: (e, gestureState) => { //e stands for event
            console.log('pan responder end', gestureState);
            if (isLeftSwipe(gestureState)) {
                Alert.alert(
                    'Add Favourite',
                    'Are you sure you wish to add' + campsite.name + 'to favourites?',
                    [
                        {
                            text: 'Cancel',
                            styles: 'cancel',
                            onPress: () => console.log('Cancel Pressed')
                        },
                        {
                            text: 'OK',
                            onPress: () => props.isFavourite
                                        ? console.log('Already set as a favourite')
                                        : props.markFavourite() 
                        }
                    ],
                    {cancelable: false}
                )
            }
        }
    })

    if (campsite) {
        return (
            <Animatable.View
            animation='fadeInDownBig'
            duration={2000}
            delay={1000}
            {...panResponder.panHandlers} //spread and combine them into new object
        >
            <Card containerStyle={ styles.cardContainer }>
                <Card.Image source={{ uri: baseUrl + campsite.image}}>
                    <View style={{ justifyContent: 'center', flex: 1 }}>
                        <Text style={styles.cardText}>
                            {campsite.name}
                        </Text>
                    </View>
                </Card.Image>
                <Text style={{ margin: 20 }}>{campsite.description}</Text>
                <View style={styles.cardRow}>
                    <Icon
                    name = {props.isFavourite? 'heart' : 'heart-o'}
                    type='font-awesome'
                    color='#f50'
                    raised
                    reverse
                    onPress={() => props.isFavourite ? console.log('Already liked') : props.markFavourite()}
                    />
                    <Icon
                    name = 'pencil'
                    type = 'font-awesome'
                    color='#5637DD'
                    raised
                    reverse
                    onPress={() => props.onShowModal()}
                    />
                </View>
                
            </Card>
            </Animatable.View>
        );
    }
    return <View />;
};

const styles = StyleSheet.create({
    cardContainer: {
        padding: 0,
        margin: 0,
        marginBottom: 20
    },
    cardRow: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 20
    },
    cardText: {
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 20,
        textAlign: 'center',
        color: 'white',
        fontSize: 20
    }
})

export default RenderCampsite;
