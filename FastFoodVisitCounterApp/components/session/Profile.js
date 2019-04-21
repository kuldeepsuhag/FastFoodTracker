import React from 'react';
import { Button } from 'react-native-elements';
import { Content, Item, Label, Input, Text, Card, CardItem } from 'native-base';
import { View, StyleSheet, Image } from 'react-native';
import { ImagePicker, Permissions } from 'expo';
import ip from "../../config";

export default class Profile extends React.Component {
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

    submitProfile() {
        this.props.history.push("/map");
        // var url = ip.ip.address;
        // axios({
        //     method: 'post',
        //     url: url + "/profile",
        //     data: {
        //         id: this.state.doctor,
        //         name: this.state.name,
        //         height: this.state.height,
        //         weight: this.state.weight,
        //         image: this.state.image
        //     }
        // }).then((response) => {
        //     console.log(response.data);
        //     this.props.history.push("/map");
        // }).catch((error) => {
        //     console.log(error);
        // });

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
                                    onChangeText={(name) => this.setState({ name })} />
                            </Item>
                            <Item floatingLabel style={styles.input}>
                                <Label>Doctor ID</Label>
                                <Input value={this.state.doctor}
                                    onChangeText={(doctor) => this.setState({ doctor })} />
                            </Item>
                            <Item floatingLabel style={styles.input}>
                                <Label>Height (in cms) </Label>
                                <Input value={String(this.state.height)} keyboardType="numeric"
                                    onChange={this.height} />
                            </Item>
                            <Item floatingLabel style={styles.input}>
                                <Label>Weight (in kgs) </Label>
                                <Input value={String(this.state.weight)} keyboardType="numeric"
                                    onChange={this.weight} />
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