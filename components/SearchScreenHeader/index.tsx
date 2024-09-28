
import { Keyboard, StyleSheet, TextInput, View } from "react-native";

import { useEffect, useState } from "react";
import { useNavigation } from "expo-router";

const SearchScreenHeader = () => {

    const handleSave = ()=>{

    }

    useEffect(() => {
        const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
          setKeyboardStatus('Keyboard Shown');
        });
        const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
          setKeyboardStatus('Keyboard Hidden');
        });
    
        return () => {
          showSubscription.remove();
          hideSubscription.remove();
        };
      }, []);

    return (
       
    )
}

export default SearchScreenHeader;

const styles = StyleSheet.create({
    
});
