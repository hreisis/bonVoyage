import { useSelector, useDispatch } from "react-redux";
import { View, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Avatar, ListItem } from "react-native-elements";
import Loading from "../components/LoadingComponent";
import { baseUrl } from "../shared/baseUrl";
import { SwipeRow } from "react-native-swipe-list-view";
import { toggleFavourite } from "../features/favourites/favouriteSlice";

const FavouritesScreen = ({ navigation }) => {
    const { campsitesArray, isLoading, errMess} = useSelector(
        (state) => state.campsites
    );
    const favourites = useSelector((state) => state.favourites);
    const dispatch = useDispatch();

    const renderFavouriteItem = ({ item: campsite }) => {
        return (
            <SwipeRow rightOpenValue={-100}>
                <View style={styles.deleteView}>
                    <TouchableOpacity
                        style={styles.deleteTouchable}
                        onPress={() => dispatch(toggleFavourite(campsite.id))}>
                        <Text style={styles.deleteText}>Delete</Text>
                    </TouchableOpacity>
                </View>
                <View>
                    {/*second view is default */}
                    <ListItem onPress={() => navigation.navigate('Directory', {
                        screen: 'CampsiteInfo',
                        params: { campsite }
                    })}
                    >
                        <Avatar rounded source={{ uri: baseUrl + campsite.image }} />
                        <ListItem.Content>
                            <ListItem.Title>{campsite.name}</ListItem.Title>
                            <ListItem.Subtitle>{campsite.description}</ListItem.Subtitle>
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
        <FlatList
            data={campsitesArray.filter((campsite) =>
                favourites.includes(campsite.id)
                )}
                renderItem={renderFavouriteItem}
                keyExtractor={(item) => item.id.toString()}
        />
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