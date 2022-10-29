import { useSelector } from 'react-redux';
import { FlatList, Text, View } from 'react-native';
import { Tile } from 'react-native-elements';
import { baseUrl } from '../shared/baseUrl';
import Loading from '../components/LoadingComponent';
import * as Animatable from 'react-native-animatable';

const DirectoryScreen = ({ navigation }) => {

    const studios = useSelector((state) => state.studios);

    if (studios.isLoading) {
        return <Loading />;
    }
    if (studios.errMess) {
        return (
            <View>
                <Text>{studios.errMess}</Text>
            </View>
        );
    }

    const renderDirectoryItem = ({ item: studio }) => {
        return (
            <Animatable.View
            animation='fadeInRightBig'
            duration={2000}
        >
            <Tile
                title={studio.name}
                caption={studio.description}
                featured
                onPress={() =>
                    navigation.navigate('StudioInfo', { studio })
                }
                imageSrc = {{ uri: baseUrl + studio.image}}
            />
            </Animatable.View>
        );
    };
    return (
        <FlatList
            data={studios.studiosArray}
            renderItem={renderDirectoryItem}
            keyExtractor={(item) => item.id.toString()}
        />
    );
};

export default DirectoryScreen;
