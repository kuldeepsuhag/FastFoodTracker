import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Footer, FooterTab, Button, Icon, Text } from 'native-base';
import { Route, Switch } from 'react-router-native'
// import { Route, Switch } from 'react-router-native'

export default class AppFooter extends React.Component {
    render() {
        return (
            <Footer style= {StyleSheet.footer}>
                <FooterTab>
                    {/* <Button active = {this.props.location.history == '/settings'}> */}
                    <Button>
                    <Icon name="apps" />
                    </Button>
                    {/* <Button active = {this.props.location.history == '/map'}> */}
                    <Button active>
                    <Icon name="navigate" />
                    </Button>
                    {/* <Button active = {this.props.location.history == '/profile'}> */}
                    <Button>
                    <Icon name="person" />
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