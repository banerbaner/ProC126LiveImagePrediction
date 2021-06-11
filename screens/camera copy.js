import React, { Component } from 'react';
import { Button, View, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";

export default class PickImage extends Component {
    state = { image: null }
    render() {
        let { image } = this.state
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Button title='Pick and image from camera roll.' onPress={this._pickImage} />
            </View >
        )
    }
    componentDidMount() {
        this.getPermissionAsync()
    }
    getPermissionAsync = async () => {
        if (Platform.OS !== 'web') {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL)
            if (status !== 'granted') {
                alert('Sorry we need camera roll permisions to make this possible')
            }
        }
    }
    upload_image = async (uri) => {
        const data = new FormData()
        let fileName = uri.split('/')[uri.split('/').length - 1]
        let type = `image/${uri.split('.')[uri.split('.').length - 1]}`
        const fileToUpload = {
            uri: uri,
            name: fileName,
            type: type,
        }
        data.append('digit', fileToUpload)
        fetch('http://37bc11b6aeed.ngrok.io', {
            method: 'POST',
            body: data,
            headers: { 'conten-type': 'multipart/form-data' }
        }).then((response) => response.json()).then((result) => {
            console.log("Success", result)
        })
            .catch((error) => {
                console.error('error', error)
            })

    }
    _pickImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowEditing: true,
                aspect: [4, 3],
                quality: 1
            })
            if (!result.cancelled) {
                this.setState({
                    image: result.data,
                })
                console.log(result.uri)
                this.upload_image(result.uri)
            }
        }
        catch (E) {
            console.log(E)
        }
    }
}