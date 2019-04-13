import React from 'react';
import { StyleSheet } from 'react-native';
import { Footer, FooterTab, Button, Icon } from 'native-base';
import { Link } from "react-router-native";

export default class AppFooter extends React.Component {

    render() {
        return (
            <Footer style={StyleSheet.footer}>
                <FooterTab>
                    <Button onPress={this.settings}>
                        <Link to="/settings">
                            <Icon name="apps" />
                        </Link>
                    </Button>
                    <Button onPress={this.map}>
                        <Link to="/map">
                            <Icon name="navigate" />
                        </Link>
                    </Button>
                    <Button>
                        <Link to="/profile">
                            <Icon name="person" />
                        </Link>
                    </Button>
                </FooterTab>
            </Footer>
        );
    }
}

const styles = StyleSheet.create({
    footer: {
        backgroundColor: 'red',
    }
});