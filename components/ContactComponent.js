import React, { Component } from 'react';
import { Text } from 'react-native';
import { Card, Button, Icon } from 'react-native-elements';
import * as Animatable from 'react-native-animatable';
import * as MailComposer from 'expo-mail-composer';





class Contact extends Component {

    sendMail() {
        MailComposer.composeAsync({
            recipients: ['confusion@food.net'],
            subject: 'Enquiry',
            body: 'To whom it may concern:'
        })
    }

    static navigationOptions = {
        title: 'Contact Us'
    };

    render() {
        return (
            <Animatable.View animation="fadeInDown" duration={2000} delay={1000}> 
            <Card
               title="Contact Information">
                <Text>
                Our Address
                <br></br>
                <br></br>
                121, Clear Water Bay Road
                <br></br>
                Clear Water Bay, Kowloon
                <br></br>
                HONG KONG
                <br></br>
                Tel: +852 1234 5678
                <br></br>
                Fax: +852 8765 4321
                <br></br>
                Email:confusion@food.net
               </Text>
            </Card>
            <Button
                            title="Send Email"
                            buttonStyle={{backgroundColor: "#512DA8"}}
                            icon={<Icon name='envelope-o' type='font-awesome' color='white' />}
                            onPress={this.sendMail}
                            />
            </Animatable.View>
        );
    }
}

export default Contact;