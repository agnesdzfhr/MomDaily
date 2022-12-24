import React, {useState} from "react";
import { View, StyleSheet, Text, TouchableHighlight} from "react-native";
import Ionicon from 'react-native-vector-icons/Ionicons';

export default(props) => {
    const [notifBool, setNotifBool] = useState(props.notif);
    return(
        <View style={[styles.activityBar, styles.shadowBar]}>
        <View style={{width:"75%"}}>
          <Text style={{fontSize: 20, fontWeight:"bold", color:'black'}}>{props.time}</Text>
          <Text style={{fontSize: 15, fontWeight:"400", color:'grey', marginLeft:2, marginTop:4}}>{props.activity}</Text>
        </View>
        <View style={{width:"25%", flex:1, flexDirection:"row", justifyContent:"center",alignItems:"center"}}>
          <TouchableHighlight onPress={() =>{
          console.log("notif activity");
          if(notifBool === true){
            setNotifBool(false);
          }else{
            setNotifBool(true);
          }
          }}
          underlayColor="white">
            <Ionicon color={notifBool? "#FDA700" : "grey"} style={{marginRight:15}} size={25} name="notifications-sharp"></Ionicon>
          </TouchableHighlight>
          <TouchableHighlight style={{borderRadius:100, backgroundColor:"red"}} onPress={() =>{
            console.log("delete activity");
            props.remove(props.keyId);
          }}
          underlayColor="#FF5959">
          <Ionicon size={22} color="white" name="close-sharp"></Ionicon>

          </TouchableHighlight>
        </View>
      </View>
    )
}

const styles = StyleSheet.create({
    activityBar:{
        backgroundColor:'white',
        height: 70,
        marginBottom: 20,
        marginHorizontal: 10,
        borderRadius: 10,
        paddingVertical: 5,
        paddingHorizontal: 10,
        flex: 1,
        flexDirection: "row"
      },
      shadowBar:{
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 4,
          shadowRadius: 0,
        },
        shadowOpacity: 0.30,
    
        elevation: 6,
      }
})