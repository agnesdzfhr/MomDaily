import React, {Component, useState }  from "react";
import {
  Button, View, Text, 
  Image, ImageBackground, 
  StyleSheet, TextInput, 
  TouchableWithoutFeedback,
  TouchableHighlight,
  ScrollView} from "react-native";
import DatePicker from 'react-native-date-picker';
import Ionicon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Activity from "./activity";


const d = new Date();
d.setHours(0);
d.setMinutes(0);
let currentHours = d.getHours;
currentHours = ("0" + currentHours).slice(-2);


function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  hours = (hours < 10? '0':'') + hours
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

let data = [
  // {activity: "Berbenah", time: "06:00 PM", notif:false},
  // {activity: "Mandi & Duha", time: "09:00 PM", notif:true},
]


const initialState = {
  newActivity: '',
  datetime: d,
  open: false,
  newTime: '00:00 AM'
}

function compareStrings(a, b) {
  // Assuming you want case-insensitive comparison

  aSecond = a.split(" ").pop();
   aFirst = a.split(" ").shift();
  
  bSecond = b.split(" ").pop();
   bFirst = b.split(" ").shift();
  console.log("bfirst " + bFirst)
  const result = aSecond.localeCompare(bSecond);
  return result !== 0 ? result : aFirst.localeCompare(bFirst);
}


class App extends Component {
  constructor(props){
    super(props);
    this.state = initialState;
  }

  componentDidMount(){
    this.getData();
  }


  storeData = async (value) => {
    try {
      const sortValue = value.sort((a,b) => compareStrings(a.time, b.time) );   
      const jsonValue = JSON.stringify(sortValue)
      await AsyncStorage.setItem('@storage_Key', jsonValue)
    } catch (e) {
      // saving error
      console.log(e)
    }
  }
  
  
  getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@storage_Key');
      data = jsonValue != null ? JSON.parse(jsonValue) : [];
      this.setState({});
    } catch(e) {
      // error reading value
      console.log("error reading value")
    }
  }

  removeActivity =(index)=>{
    let cloneActivity = [...data];
    cloneActivity.splice(index, 1);
    data = cloneActivity;
    this.setState(initialState);
    this.storeData(data);
  }

  notifToggle = (index) => {
    let cloneActivity = [...data];
    
    if(cloneActivity[index].notif === true){
      cloneActivity[index].notif = false;
    }else{
      cloneActivity[index].notif = true;
    }
    data = cloneActivity;
    this.storeData(data);
    this.setState(initialState);

  }

  render() {
    return (
      <View style={styles.container}>
      <ImageBackground source={require('./assets/Home.png')} resizeMode="cover" style={styles.image}>
      <View style={{position:"absolute", top:0}}>
      <Image source={require('./assets/logo.png')} resizeMode="cover"></Image>
        <View style={[styles.addArea, styles.shadowCard]}>
          <Text style={{fontWeight:"bold", color: '#2F2F2F'}}>Add Your Activity Here</Text>
          <TextInput style={styles.inputActivity}
            placeholder="Your Activity..."
            placeholderTextColor={"grey"}
            keyboardType="text"
            ref={input =>{this.textInput = input}}
            onChangeText={(text)=>{
              this.setState({newActivity:text});
            }}></TextInput>
          <TouchableWithoutFeedback onPress={() => this.setState({open:true})}>
          <View style={styles.addTime}>
            <DatePicker
              modal
              open={this.state.open}
              date={this.state.datetime}
              mode="time"
              onConfirm={(date) => {
                this.setState({open:false});
                this.setState({datetime:date});
                this.setState({newTime: formatAMPM(date)})
              }}
              onCancel={() => {
                this.setState({open:false});
              }}>
            </DatePicker>
            <Text
            style={styles.inputDate}>
            {this.state.newTime}
            </Text>
            
          </View>
          </TouchableWithoutFeedback>
          <TouchableHighlight style={[styles.addView, styles.shadowCard]} onPress={() =>{
            const newData = {activity: this.state.newActivity, time: this.state.newTime, notif: true }
            data.push(newData);
            console.log(data);
            this.textInput.clear();
            this.setState(initialState);
            this.storeData(data);


          }}
          underlayColor="#89BFFF">
          <View>
            <Ionicon style={styles.iconPlus} name="add-sharp" size={45} color="#FFFF"></Ionicon>

          </View>

          </TouchableHighlight>
        </View>
      </View>
      <ScrollView style={styles.activityArea}>
      <Text style={{fontWeight:"600", fontSize:18, color:'black', marginLeft:10, marginBottom: 5}}>Activity</Text>
      {data.map((key, i)=>{
        return(
          <View key={i}>
            <Activity keyId={i} activity={key.activity} time={key.time} notif={key.notif} remove={this.removeActivity} notifTggl={this.notifToggle}></Activity>
          </View>
        )
      })}
      </ScrollView>

      </ImageBackground> 
    </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent:"flex-start"
  },
  image: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
  },
  addArea:{
    backgroundColor: 'white',
    height: 180,
    width: 291,
    borderRadius: 15,
    paddingTop: 5,
    paddingLeft: 15,
    paddingRight: 15,
    
  },
  shadowCard:{
    elevation: 10,
    shadowColor: '#000',
  },
  inputActivity:{
    height: 60,
    marginTop: 10,
    width:'100%',
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    color: "black"
  },
  inputDate:{
    height: 40,
    marginTop: 10,
    width:'100%',
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    textAlign: "center",
    color:"black"
  },

  addTime: {
    width: '100%',
  },
  addView:{
    backgroundColor: '#0074FD',
    alignSelf: "flex-end", 
    padding: 0,
    marginTop: 10,
    marginRight:-20,
    borderRadius: 50,
  },
  activityArea:{
    backgroundColor:"#F2F2F2",
    marginTop: 50,
    marginBottom: 350,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 10,
    width: '100%',
    top: 350
  },

})

export default App