import React from 'react';
import { View } from 'react-native';
import { Footer, FooterTab, Button, Icon } from 'native-base';
export default class AppFooter extends React.Component {
    constructor(props, { }) {
        super(props);
        this.settings = this.settings.bind(this);
        this.map = this.map.bind(this);
        this.profile = this.profile.bind(this);
    }
    settings() {
        this.props.props.history.push({
            pathname: "/settings"
        })
    } 
    map() {
        this.props.props.history.push({
            pathname: "/map"
        })
    } 
    profile() {
        console.log("click")
        this.props.props.history.push({
            pathname: "/viewProfile"
        })
    }

    render() {
        return (
            <View style={{ height: 50 }}>
                <Footer>
                    <FooterTab>
                        <Button onPress={this.settings}>
                                <Icon name="apps" />
                         </Button>
                        <Button onPress={this.map}>
                                <Icon name="navigate" />
                        </Button>
                        <Button onPress={this.profile}>
                                <Icon name="person" />
                        </Button>
                    </FooterTab>
                </Footer>
            </View>
        );
    }
}
