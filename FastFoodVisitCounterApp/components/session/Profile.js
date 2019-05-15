import React from 'react';
import { Button } from 'react-native-elements';
import { Content, Item, Label, Input, Text, Card, CardItem } from 'native-base';
import { View, StyleSheet, Image , AsyncStorage } from 'react-native';
import { ImagePicker, Permissions } from 'expo';
import ip from '../../config';
import axios from "axios";
import {connect} from 'react-redux'
import { loggedIn } from '../../redux/actions/index'

class Profile extends React.Component {
    constructor(props, { }) {
        super(props);
        this.state = {
            name: "",
            doctor: "",
            height: 0,
            weight: 0,
            bmi: 0,
            image: null
        };
        this.height = this.height.bind(this);
        this.bmi = this.bmi.bind(this);
        this.weight = this.weight.bind(this);
        this.submitProfile = this.submitProfile.bind(this);
        this.handleFullNameChange = this.handleFullNameChange.bind(this);
        this.handleDocIDChange = this.handleDocIDChange.bind(this);
        this.handleHeightChange = this.handleHeightChange.bind(this);
        this.handleWeighttChange = this.handleWeighttChange.bind(this);
    }

    height(e) {
        this.setState({ height: e.nativeEvent.text }, function () {
            this.bmi();
        });

    }

    weight(e) {
        this.setState({ weight: e.nativeEvent.text }, function () {
            this.bmi();
        });
    }

    bmi() {
        if (this.state.height > 0 && this.state.weight > 0) {
            var bmi = this.state.weight / ((this.state.height / 100) * (this.state.height / 100));
            this.setState({ bmi: bmi })
        }
    }

    handleFullNameChange(event) {
        let processedData = event.nativeEvent.text;
        this.setState({name: processedData})
    }

    handleDocIDChange(event) {
        let processedData = event.nativeEvent.text;
        this.setState({doctor: processedData})
    }
    
    handleHeightChange(event) {
        let processedData = event.nativeEvent.text;
        this.setState({height: processedData})
        this.bmi();
    }
    
    handleWeighttChange(event) {
        let processedData = event.nativeEvent.text;
        this.setState({weight: processedData})
         this.bmi();
    }

    storeData = async () => {
        console.log("savingg");
        var that = this;
        try {
            console.log(this.props.userData.email)
            const username = ["@username", this.props.userData.email]
            const password = ["@password", this.props.userData.password]
            let akshay = await AsyncStorage.multiSet([username, password] , function(){
                console.log("Saved");
                that.props.dispatch(loggedIn(true));
                that.props.history.push("/map");
            })
            console.log(akshay);
        } catch (e) {
            // saving error
        }
    }

    submitProfile() {
        var url = ip.ip.address;
        axios({
            method: 'post',
            url: url + "/signup",
            data: {
                email: this.props.userData.email,
                password: this.props.userData.password,
                patientId: this.props.userData.id,
                doctorId: this.state.doctor,
                name: this.state.name,
                height: this.state.height,
                weight: this.state.weight,
                image: this.state.image
            }
        }).then((response) => {
            console.log(response.data);
            this.storeData();
        }).catch((error) => {
            console.log(error);
        });
    }


    _pickImage = async () => {
        let { camera } = await Permissions.askAsync(Permissions.CAMERA);
        let { camera_roll } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
        });
        if (!result.cancelled) {
            this.setState({ image: result.uri });
        }
    };

    render() {
        //  console.log(this.state.email);
        return (
            <View style={styles.container}>
                <Card style={styles.card}>
                    <CardItem header bordered>
                        <Text>My Profile</Text>
                    </CardItem>
                    <CardItem bordered>
                        <Content>
                            <Button
                                title="Choose Image"
                                onPress={this._pickImage}
                            />
                            {this.state.image &&
                                <Image source={{ uri: this.state.image }} style={{ width: 200, height: 200 }} />}
                            <Item floatingLabel style={styles.input}>
                                <Label>Full Name</Label>
                                <Input value={this.state.name}
                                    onChange={this.handleFullNameChange} />
                            </Item>
                            <Item floatingLabel style={styles.input}>
                                <Label>Doctor ID</Label>
                                <Input value={this.state.doctor}
                                    onChange={this.handleDocIDChange} />
                            </Item>
                            <Item floatingLabel style={styles.input}>
                                <Label>Height (in cms) </Label>
                                <Input value={String(this.state.height)} keyboardType="numeric"
                                    onChange={this.handleHeightChange} />
                            </Item>
                            <Item floatingLabel style={styles.input}>
                                <Label>Weight (in kgs) </Label>
                                <Input value={String(this.state.weight)} keyboardType="numeric"
                                    onChange={this.handleWeighttChange} />
                            </Item>
                            <Label>BMI</Label>
                            <Label>{this.state.bmi}</Label>
                        </Content>
                    </CardItem>
                    <CardItem bordered style={styles.card}>
                        <Button title="Submit" onPress={this.submitProfile} />
                    </CardItem>
                </Card>
            </View >
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch',
        // paddingTop: 40,
        backgroundColor: '#3066c9',
        height: '100%'
    },
    wrapper: {
        alignItems: 'center', paddingBottom: 40, paddingTop: 40
    },
    card: {
        flexDirection: 'column',
        justifyContent: 'center',
        marginLeft: '5%',
        marginRight: '5%',
        maxWidth: '100%'
    },
    input: {
        marginBottom: '2%'
    }
});

const mapStateToProps = (state) => {
    return {
        userData: state
    }
}

export default connect(mapStateToProps)(Profile); 