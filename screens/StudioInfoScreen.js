import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { FlatList, StyleSheet, Text, View, Button, Modal,} from 'react-native';
import RenderStudio from '../features/studios/RenderStudio';
import { toggleFavourite } from '../features/favourites/favouriteSlice';
import {Input, Rating, Icon} from 'react-native-elements';
import { postComment } from '../features/comments/commentsSlice';
import * as Animatable from 'react-native-animatable';

const StudioInfoScreen = ({ route }) => {
    const { studio } = route.params;
    const comments = useSelector((state) => state.comments);
    const favourites = useSelector((state) => state.favourites);
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    const [rating, setRating] = useState('5');
    const [author, setAuthor] = useState('');
    const [text, setText] = useState('');

    const handleSubmit = () => {
        const newComment = {
            studioId: studio.id,
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
        <Animatable.View
        animation='fadeInUp'
        duration={2000}
        delay={1000}
    >        
        <FlatList //FlatList must be at top level
            data={comments.commentsArray.filter(
                (comment) => comment.studioId === studio.id
            )}
            renderItem={renderCommentItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{
                marginHorizontal: 20,
                paddingVertical: 20
            }}
            ListHeaderComponent={
                <>
                    <RenderStudio 
                        studio={studio}
                        isFavourite={favourites.includes(studio.id)}
                        markFavourite={() => dispatch(toggleFavourite(studio.id))} 
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
                        color='#101119'
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
        </Animatable.View>

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

export default StudioInfoScreen;