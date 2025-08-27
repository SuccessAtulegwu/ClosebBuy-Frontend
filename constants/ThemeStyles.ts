import {StyleSheet } from "react-native"
import { moderateScale, scale, verticalScale } from "react-native-size-matters"
import { fontSizes } from "./app.constants"

export const appStyles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: scale(100),
        height: verticalScale(100),
        resizeMode: 'contain',
    },
    button: {
        paddingVertical: verticalScale(10),
        paddingHorizontal: scale(20),
        borderRadius: moderateScale(8),
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: scale(100),
    },
    buttonText: {
        fontSize: moderateScale(fontSizes.FONT20),
        fontWeight: 'bold',
    },
    disabled: {
        backgroundColor: '#cccccc',
    },
})

