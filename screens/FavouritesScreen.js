import { useSelector, useDispatch } from "react-redux";
import { View, FlatList, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Avatar, ListItem } from "react-native-elements";
import Loading from "../components/LoadingComponent";
import { baseUrl } from "../shared/baseUrl";
import { SwipeRow } from "react-native-swipe-list-view";
import { toggleFavourite } from "../features/favourites/favouriteSlice";
import * as Animatable from 'react-native-animatable';

const FavouritesScreen = ({ navigation }) => {
    const { studiosArray, isLoading, errMess} = useSelector(
        (state) => state.studios
    );
    const favourites = useSelector((state) => state.favourites);
    const dispatch = useDispatch();

    const renderFavouriteItem = ({ item: studio }) => {
        return (
            <SwipeRow rightOpenValue={-100}>
                <View style={styles.deleteView}>
                    <TouchableOpacity
                        style={styles.deleteTouchable}
                        onPress={() => Alert.alert('Delete Favourites?',
                            'Are you sure you wish to delete the favourite studio ' + studio.name + '?',
                            [
                                {
                                    text: 'Cancel',
                                    onPress: () => console.log(studio.name + 'Not Deleted'),
                                    style: 'cancel'
                                },
                                {
                                    text: 'OK',
                                    onPress: () => dispatch(toggleFavourite(studio.id))
                                    
                            }
                            ],
                            { cancelable: false }
                            )}>
                            {/*dispatch(toggleFavourite(studio.id))} DELETE DIRECTLY*/}
                        <Text style={styles.deleteText}>Delete</Text>
                    </TouchableOpacity>
                </View>
                <View>
                    {/*second view is default */}
                    <ListItem onPress={() => navigation.navigate('Directory', {
                        screen: 'StudioInfo',
                        params: { studio }
                    })}
                    >
                        <Avatar rounded source={{ uri: baseUrl + studio.image }} />
                        <ListItem.Content>
                            <ListItem.Title>{studio.name}</ListItem.Title>
                            <ListItem.Subtitle>{studio.description}</ListItem.Subtitle>
                        </ListItem.Content>
                    </ListItem>
                </View>
                
            </SwipeRow>

        )
    }

    if (isLoading) {
        return <Loading />;
    }
    if (errMess) {
        return (
            <View>
                 <Text>{errMess}</Text>
            </View>
        )
    }
    return (
        <Animatable.View
        animation='fadeInRightBig'
        duration={2000}
    >
        <FlatList
            data={studiosArray.filter((studio) =>
                favourites.includes(studio.id)
                )}
                renderItem={renderFavouriteItem}
                keyExtractor={(item) => item.id.toString()}
        />
        </Animatable.View>
    )
};

const styles = StyleSheet.create({
    deleteView: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        flex: 1
    },
    deleteTouchable: {
        backgroundColor: 'red',
        height: '100%',
        justifyContent: 'center'
    },
    deleteText: {
        color: 'white',
        fontWeight: '700',
        textAlign: 'center',
        fontSize: 16,
        width: 100
    }
})

export default FavouritesScreen;