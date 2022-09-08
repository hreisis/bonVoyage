import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { FlatList, StyleSheet, Text, View, Button, Modal,} from 'react-native';
import RenderCampsite from '../features/campsites/RenderCampsite';
import { toggleFavourite } from '../features/favourites/favouriteSlice';
import {Input, Rating, Icon} from 'react-native-elements';
import { postComment } from '../features/comments/commentsSlice';

const CampsiteInfoScreen = ({ route }) => {
    const { campsite } = route.params;
    const comments = useSelector((state) => state.comments);
    const favourites = useSelector((state) => state.favourites);
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    const [rating, setRating] = useState('5');
    const [author, setAuthor] = useState('');
    const [text, setText] = useState('');

    const handleSubmit = () => {
        const newComment = {
            campsiteId: campsite.id,
            author,
            rating,
            text
        };
        setShowModal(!showModal);
        dispatch(postComment(newComment));
    };

    const resetForm = () => {
        setRating('5');
        setAuthor('');
        setText('');
    }


    const renderCommentItem = ({ item }) => {
        return (
            <View style={styles.commentItem}>
                <Text style={{ fontSize: 14 }}>{item.text}</Text>
                <Rating 
                    startingValue = {rating}
                    imageSize = {10}
                    readonly
                    style={{paddingVertical: '5%',
                            alignItems: 'flex-start'}}
                    />
                <Text style={{ fontSize: 12 }}>{
                    `-- ${item.author}, ${item.date}`  
                }</Text>
            </View>
        );
    };

    return (
        <>        
        <FlatList //FlatList must be at top level
            data={comments.commentsArray.filter(
                (comment) => comment.campsiteId === campsite.id
            )}
            renderItem={renderCommentItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{
                marginHorizontal: 20,
                paddingVertical: 20
            }}
            ListHeaderComponent={
                <>
                    <RenderCampsite 
                        campsite={campsite}
                        isFavourite={favourites.includes(campsite.id)}
                        markFavourite={() => dispatch(toggleFavourite(campsite.id))} 
                        onShowModal={() => setShowModal(!showModal)}/>
                    <Text style={styles.commentsTitle}>Comments</Text>
                </>
            }
        />
        <Modal
        animationType='slide'
        transparent={false}
        visible={showModal}
        onRequestClose={() => setShowModal(!showModal)}>
            <View style={styles.modal}>
                <Rating 
                    showRating
                    startingValue = {rating}
                    imageSize = {40}
                    onFinishRating={(rating)=> setRating(rating)} 
                    style={{paddingVertical: 10}}
                />
                <Input 
                    placeholder='Author'
                    leftIcon={
                        <Icon 
                            name='user-o'
                            type='font-awesome'
                        />
                    }
                    leftIconContainerStyle={{paddingRight: 10}}
                    onChangeText={(author)=> setAuthor(author)}
                    //value={text}
                />
                <Input 
                    placeholder='Comment'
                    leftIcon={
                        <Icon 
                        name='comment-o'
                        type='font-awesome'
                    />
                    }
                    leftIconContainerStyle={{paddingRight: 10}}
                    onChangeText={(text)=> setText(text)}
                    //value={text}
                />
                <View style={{margin: 10}}>
                    <Button 
                        onPress={() => {
                            handleSubmit();
                            resetForm();
                        }}
                        color='#5637DD'
                        title='Submit'
                    />
                </View>
                <View style={{margin: 10}}>
                    <Button
                        onPress={() => {
                            setShowModal(!showModal);
                            resetForm();
                        }}
                        color='#808080'
                        title='Cancel'
                    />
                </View>
            </View>
        </Modal>
        </>

    )
};

const styles = StyleSheet.create({
    commentsTitle: {
        textAlign: 'center',
        backgroundColor: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        color: '#43484D',
        padding: 10,
        paddingTop: 30
    },
    commentItem: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#fff'
    },
    modal: {
        justifyContent: 'center',
        margin: 20
    }
});

export default CampsiteInfoScreen;