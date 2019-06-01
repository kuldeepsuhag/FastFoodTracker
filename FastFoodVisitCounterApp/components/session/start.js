import {
    View,
    StyleSheet,
    ImageBackground,
    Image,
    Dimensions,

    TextInput,
    TouchableOpacity
} from 'react-native';
import { Content, Item, Label, Input, Text, Card, CardItem } from 'native-base';
import doc from '../../Images/doc.gif'
import ip from "../../config";
import React from 'react';
import { connect } from 'react-redux'
import { ThemeConsumer } from 'react-native-elements';
const { width: WIDTH } = Dimensions.get('window')
const { height: HEIGHT } = Dimensions.get('window')

class Start extends React.Component {
    constructor(props, { }) {
        super(props);
        this.signup = this.signup.bind(this);
        this.signin = this.signin.bind(this);
    }

    signup() {
        this.props.history.push({
            pathname: "/signup"
        })
    }

    signin() {
        this.props.history.push({
            pathname: "/signin"
        })
    }


    render() {
        return (
            <ImageBackground backgroundColor='white' style={styles.backgroundcontainer}>


                <View style={styles.logocontainer}>
                    <Image source={doc} style={styles.image} />
                </View>
                <View>
                    <Text style={styles.text} h3>
                        Fast Food Visit Counter
                    </Text>
                </View>
                <View>

                    <TouchableOpacity style={styles.btnlogin} onPress={this.signin}>
                        <Text style={styles.text}>SignIn</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnlogin} onPress={this.signup}>
                        <Text style={styles.text}>Register</Text>

                    </TouchableOpacity>

                </View>


            </ImageBackground>
        );
    }
}
const styles = StyleSheet.create({
    backgroundcontainer: {
        flex: 1,
        width: null,
        height: HEIGHT,
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        width: 290,
        height: HEIGHT - 190,
        borderRadius: 130
    },
    btnlogin: {
        width: 100,
        height: 45,
        borderRadius: 45,
        backgroundColor: "#432577",
        justifyContent: 'center',
        marginTop: 20

    },
    text: {
        color: "rgb(36,133,202)",
        fontSize: 16,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold'
    }
});
export default connect()(Start)