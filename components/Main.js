import React, { useEffect } from 'react'
import { Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { clearData, fetchUser, fetchUserFollowing, fetchUserPosts } from '../redux/actions'
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs"
import FeedScreen from './main/Feed'
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import ProfileScreen from './main/Profile'
import SearchScreen from './main/Search'
import firebase from 'firebase'

function Main() {
    const { currentUser } = useSelector(state => state.userState)
    const dispatch = useDispatch()
    const Tab = createMaterialBottomTabNavigator()
    const EmptyScreen = () => {
        return (null)
    }
    useEffect(() => {
        dispatch(clearData())
        dispatch(fetchUser())
        dispatch(fetchUserPosts())
        dispatch(fetchUserFollowing())
    }, [])

    return (
        <Tab.Navigator initialRouteName="Feed" labeled={false}>
            <Tab.Screen
                name="Feed"
                component={FeedScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="home" color={color} size={25} />
                    )
                }}
            />
            <Tab.Screen
                name="Search"
                component={SearchScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="magnify" color={color} size={25} />
                    )
                }}
            />
            <Tab.Screen
                name="AddContainer"
                listeners={({ navigation }) => ({
                    tabPress: event => {
                        event.preventDefault()
                        navigation.navigate("Add")
                    }
                })}
                component={EmptyScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="plus-box" color={color} size={25} />
                    )
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                listeners={({ navigation }) => ({
                    tabPress: event => {
                        event.preventDefault()
                        navigation.navigate("Profile", { uid: firebase.auth().currentUser.uid })
                    }
                })}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="account-circle" color={color} size={25} />
                    )
                }}
            />
        </Tab.Navigator>
    )
}

export default Main