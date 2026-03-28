import React from 'react';
import { StyleSheet, } from 'react-native';
import {View } from 'react-native';
import { scale, shadow, wp } from '../utils'

interface Props {
    style?: any;
    children?: React.ReactNode;
    type?: string 
  }
  
const Card: React.FC<Props> = ({  style, children, type}) => {
  return (
    <View style={[styles.pill, style]}>
        {children}
    </View>
  );
};
export default Card;


const styles = StyleSheet.create({
    card:{
        borderStyle: 'solid',
        borderWidth: scale(.8),
        borderColor: 'rgb(265,265,275)',

        padding: 10,

        borderRadius: scale(2),
        backgroundColor: '#fff',
        marginBottom: scale(10),
    },
    pill:{

      padding: 20,

      borderRadius: scale(4),
      backgroundColor: 'rgb(265,265,275)',
      shadowOffset:{
        width:scale(6),
         height: scale(5)},
          ...shadow
  },
  
});

