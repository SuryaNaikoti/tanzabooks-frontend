import React from 'react';
import { StyleSheet, } from 'react-native';
import {View } from 'react-native';
import { scale, shadow } from '../utils'

interface Props {
    style?: any;
    children?: React.ReactNode;
    type?: string 
  }
  
const Boxes: React.FC<Props> = ({  style, children, type}) => {
  return (
    <View style={[styles.pill, style]}>
        {children}
    </View>
  );
};
export default Boxes;


const styles = StyleSheet.create({
    card:{
        borderStyle: 'solid',
        borderWidth: scale(.1),
        borderColor: 'rgba(51, 72, 85, 0.5)',
        // padding: scale(15),
        borderRadius: scale(2),
        backgroundColor: '#fff',
        marginBottom: scale(10)
    },
    pill:{
      padding: scale(15),
      borderRadius: scale(4),
      backgroundColor: '#fff',
      shadowOffset:{width: scale(6), height: scale(5)}, ...shadow
  },
});


