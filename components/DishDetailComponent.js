import React, { Component } from 'react';
import { Text, View, ScrollView, FlatList, Modal, StyleSheet, Button, Alert, PanResponder, Share } from 'react-native';
import { Card, Icon, Input, Rating } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment } from '../redux/ActionCreators';
import * as Animatable from 'react-native-animatable';



const mapStateToProps = state => {
    return {
        dishes: state.dishes,
        comments: state.comments,
        favorites: state.favorites
    }
}

const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment)),

})



function RenderDish(props) {
    const dish = props.dish;


    // handleViewRef = ref => this.view = ref;



    const recognizeDrag = ({ moveX, moveY, dx, dy }) => {
        if (dx < -200)
            return true;
        else
            return false;
    }


    const recognizeComment = ({ moveX, moveY, dx, dy }) => {
        if (dx > 200)
            return true;
        else
            return false;
    }


    const panResponder = PanResponder.create({

        onStartShouldSetPanResponder: (e, gestureState) => {
            return true;
        },
        // onPanResponderGrant: () => {this.view.rubberBand(1000).then(endState => console.log(endState.finished ? 'finished' : 'cancelled'));},
        onPanResponderEnd: (e, gestureState) => {
            console.log("pan responder end", gestureState);
            if (recognizeDrag(gestureState))
                console.log("recognizeFavorite");
            Alert.alert(
                'Add Favorite',
                'Are you sure you wish to add ' + dish.name + ' to favorite?',
                [
                    { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                    { text: 'OK', onPress: () => { props.favorite ? console.log('Already favorite') : props.onPress() } },
                ],
                { cancelable: false }
            );

            if (recognizeComment(gestureState)) {

                console.log("recognizeComment");
                props.handleReservation()
            }


            return true;
        }
    })

    const shareDish = (title, message, url) => {
        Share.share({
            title: title,
            message: title + ': ' + message + ' ' + url,
            url: url
        },{
         dialogTitle: 'Share ' + title
        })
    }

    if (dish != null) {
        return (
            <Animatable.View animation="fadeInDown" duration={2000} delay={1000}
                {...panResponder.panHandlers}
            // ref={this.handleViewRef}
            >
                <Card
                    featuredTitle={dish.name}
                    image={{ uri: baseUrl + dish.image }}>
                    <Text style={{ margin: 10 }}>
                        {dish.description}
                    </Text>
                    <View style={styles.RowIcon}>
                        <Icon
                            raised
                            reverse
                            name={props.favorite ? 'heart' : 'heart-o'}
                            type='font-awesome'
                            color='#f50'
                            onPress={() => props.favorite ? console.log('Already favorite') : props.onPress()}
                        />
                        <Icon
                            raised
                            reverse
                            name={'pencil'}
                            type='font-awesome'
                            color='#0089ff'
                            onPress={() => props.handleReservation()}
                        />
                         <Icon
                            raised
                            reverse
                            name='share'
                            type='font-awesome'
                            color='#51D2A8'
                            style={styles.cardItem}
                            onPress={() => shareDish(dish.name, dish.description, baseUrl + dish.image)} />
                    </View>
                </Card>
            </Animatable.View>
        );
    }
    else {
        return (<View></View>);
    }
}

function RenderComments(props) {

    const comments = props.comments;

    const renderCommentItem = ({ item, index }) => {

        return (
            <View key={index} style={{ margin: 10 }}>
                <Text style={{ fontSize: 14 }}>{item.comment}</Text>
                <Text style={{ fontSize: 12 }}> <Rating
                    imageSize={12}
                    readonly
                    startingValue={item.rating}
                /></Text>
                <Text style={{ fontSize: 12 }}>{'-- ' + item.author + ', ' + item.date} </Text>
            </View>
        );
    };

    return (
        <Animatable.View animation="fadeInUp" duration={2000} delay={1000}>
            <Card title='Comments' >
                <FlatList
                    data={comments}
                    renderItem={renderCommentItem}
                    keyExtractor={item => item.id.toString()}
                />
            </Card>
        </Animatable.View>
    );
}


class Dishdetail extends Component {




    constructor(props) {
        super(props);
        this.state = {
            rating: 5,
            author: '',
            comment: '',
            showModal: false,

        }
    }

    markFavorite(dishId) {
        this.props.postFavorite(dishId);
    }

    static navigationOptions = {
        title: 'Dish Details'
    };

    toggleModal() {
        console.log(JSON.stringify(this.state));
        this.setState({ showModal: !this.state.showModal });
    }

    handleReservation() {
        console.log(JSON.stringify(this.state));
        this.toggleModal();
    }

    postcomment() {
        const { rating, author, comment } = this.state;
        const dishId = this.props.navigation.getParam('dishId', '');
        this.props.postComment(dishId, rating, author, comment);
        console.log(dishId);
    }


    resetForm() {
        this.setState({
            rating: 5,
            author: '',
            comment: '',
            showModal: false
        });
    }





    render() {
        const dishId = this.props.navigation.getParam('dishId', '');
        return (
            <ScrollView>
                <RenderDish dish={this.props.dishes.dishes[+dishId]}
                    favorite={this.props.favorites.some(el => el === dishId)}
                    onPress={() => this.markFavorite(dishId)}
                    handleReservation={() => this.handleReservation()}
                />
                <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)}
                    postComment={this.props.postComment} dishId={dishId} />
                <Modal animationType={"fade"}
                    transparent={false}
                    visible={this.state.showModal}
                    onDismiss={() => this.toggleModal()}
                    onRequestClose={() => this.toggleModal()}>
                    <View style={styles.modal}>
                        <Rating
                            type='star'
                            ratingCount={5}
                            imageSize={60}
                            showRating
                            startingValue={this.state.rating}
                            onFinishRating={value => this.setState({ rating: value })}
                        />
                        <Input
                            placeholder='Author'
                            value={this.state.author}
                            onChangeText={value => this.setState({ author: value })}
                            leftIcon={
                                <Icon
                                    name='user-o'
                                    type='font-awesome'
                                    size={20} />
                            }
                        >
                        </Input>

                        <Input
                            placeholder='Comment'
                            value={this.state.comment}
                            onChangeText={value => this.setState({ comment: value })}
                            leftIcon={
                                <Icon
                                    name={'comment'}
                                    size={20}
                                    color='black'
                                />
                            }
                        />

                        <Button
                            onPress={() => { this.toggleModal(); this.postcomment(); this.resetForm() }}
                            color="#512DA8"
                            title="SUBMIT"
                        />
                        <Button
                            onPress={() => { this.toggleModal(); this.resetForm() }}
                            color="#D3D3D3"
                            title="CANCEL"
                        />
                    </View>
                </Modal>
            </ScrollView>

        );
    }
}

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'center',
        margin: 10
    },
    RowIcon: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },

});
export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);