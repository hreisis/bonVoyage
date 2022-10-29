import { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native'; 
import { Card } from 'react-native-elements';
import StudioInfoScreen from './StudioInfoScreen';
import { useSelector } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import Loading from '../components/LoadingComponent';


const FeaturedItem = ( props) => {

    const { item } = props;

    if (props.isLoading) {
        return <Loading />
    }
    if (props.errMess) {
        return(
            <View>
                <Text>{props.errMess}</Text>
            </View>
        )
    }

    if (item) {
        return (
            <Card containerStyle= {{ padding: 0 }}>
                <Card.Image source={{ uri: baseUrl + item.image }}>
                    <View style={{ justifyContent: 'center', flex: 1 }}>
                        <Text
                            style={{
                                color:  'white',
                                textAlign: 'center',
                                fontSize: 20
                            }}
                            >
                                {item.name}
                        </Text>
                    </View>
                </Card.Image>
                <Text style={{ margin: 20 }}>{item.description}</Text>
            </Card>
        );
    }
    return <View />;
};

const HomeScreen = () => {
    const studios = useSelector((state) => state.studios);
    const promotions = useSelector((state) => state.promotions);
    const scaleValue = useRef(new Animated.Value(0)).current;
    const scaleAnimation = Animated.timing(scaleValue, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true
    })

    const featPromotion = promotions.promotionsArray.find((item) => item.featured);

    useEffect(() => {
        scaleAnimation.start();
    }, []) //function as the first item, and then dependecy array (empty then will show up when the screen first loaded)

    return (
        <Animated.ScrollView style={{ transform: [{ scale: scaleValue }]}}>
            <FeaturedItem 
                item={featPromotion}
                isLoading={promotions.isLoading}
                errMess={promotions.errMess} />
        </Animated.ScrollView>
    );
};

export default HomeScreen;