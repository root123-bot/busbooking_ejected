import React, { memo, useContext, useState } from "react";
import { View, StyleSheet, Text, Image, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { COLORS } from "../../../constants/colors";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import RouteCard from "../../../components/RouteCard";
import { AppContext } from "../../../store/context";
import { HStack, Menu, Pressable } from "native-base";
import moment from "moment";
/*
  POINT OF NOTE: there is no way tukawa na duplicates in our trips coz each trip is unique and it can contains 
  duplicates of "bookings" but the bookings are inner array found in it so here we resolve the all trips from 
  our api so there is no way to have filtered trips and be the same
*/

function sortByDepartureTime({ mt, ddate}) {
  let departureDate = JSON.stringify(ddate).split('T')[0]
  departureDate = departureDate.substring(1)
  const metadata = [...mt]

  const manipulated_metatada = metadata.map(item => {
    const date = `${departureDate} ${item.bus_departure_time}`
    const dtime = moment(date, "YYYY-MM-DD HH:mm").valueOf()
    return {
      ...item,
      dtime
    }
  })
  
  return manipulated_metatada.sort((a, b) => (a.dtime - b.dtime))
}

function sortByBusName(mt) {
  const metadata = [...mt]
  const bus_names = metadata.map(val => val.bus_info.bus_name)
  
  const sorted = bus_names.sort()

  const new_metadata = []
  
  for (let name of sorted) {
    const foundList = metadata.filter(item => item.bus_info.bus_name === name)
    
    if (foundList) {
      if (foundList.length  === 0) {
        new_metadata.push(foundList.find(item => item.bus_info.bus_name === name))
      }
      else {
        // we have more that one list, for that case we should check if we have 
        // already item in new_metadata with that name just track how many items
        // if there is two then we should go to the second data...
        const alredy_added =  new_metadata.filter(data => data.bus_info.bus_name === name)
        
        if (!alredy_added) {
          new_metadata.push(foundList.find(item => item.bus_info.bus_name === name))
        }
        else {
          // then here we have the already added data check its length
          new_metadata.push(foundList[alredy_added.length])
        }
      }
    }
  }
  
  return new_metadata
} 


function DetailsScreen({ navigation }) {
  const AppCtx = useContext(AppContext);
  const [activeFilterIcon, setActiveFilterIcon] = useState('sort')
  const [trips, setTrips]  = useState(AppCtx.userTripMetadata.founded_trips)

  const updateActiveFilterIcon = (icon) => () => {
    setActiveFilterIcon(icon)

    switch(icon) {
      case 'sort':
        return setTrips(AppCtx.userTripMetadata.founded_trips)
      case 'sort-alphabetical-ascending':
        return setTrips(sortByBusName(AppCtx.userTripMetadata.founded_trips))
      case 'sort-numeric-variant':
        const metadata = [...AppCtx.userTripMetadata.founded_trips]
        return setTrips(metadata.sort((b, a) => a.bus_fare - b.bus_fare))
      case 'clock-fast':
        const mt = [...AppCtx.userTripMetadata.founded_trips]
        const output = sortByDepartureTime({mt, ddate: AppCtx.userTripMetadata.departureDate})
        return setTrips(output);
      default:
        return;
    }
  }

  return (
    <>
      <StatusBar style="light" />
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.background,
        }}
      >
        <View
          style={{
            width: "100%",
            height: "15%",
            backgroundColor: COLORS.darkprimary,
            justifyContent: "flex-end",
            paddingBottom: 15,
          }}
        >
          <View>
            <View
              style={{
                width: "85%",
                marginLeft: "auto",
                marginRight: "auto",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    width: "20%",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => navigation.navigate("HomeScreen")}
                  >
                    <Ionicons name="arrow-back" size={24} color="white" />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    width: "60%",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <View
                      style={{
                        width: "40%",
                      }}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontSize: 17,
                          fontWeight: "bold",
                          fontFamily: "overpass-reg",
                          marginTop: 5,
                        }}
                        numberOfLines={1}
                      >
                        {AppCtx.userTripMetadata &&
                          AppCtx.userTripMetadata.from}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: "10%",
                      }}
                    >
                      <Image
                        source={require("../../../assets/images/icons/right-arrow.png")}
                        style={{
                          width: "100%",
                          height: 20,
                        }}
                      />
                    </View>
                    <View
                      style={{
                        width: "40%",
                      }}
                    >
                      <View>
                        <Text
                          style={{
                            color: "white",
                            fontSize: 18,
                            fontWeight: "bold",
                            fontFamily: "overpass-reg",
                            marginTop: 5,
                          }}
                          numberOfLines={1}
                        >
                          {AppCtx.userTripMetadata.destination}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: 12,
                        fontFamily: "overpass-reg",
                      }}
                    >{`${AppCtx.userTripMetadata.departureDate.toDateString()}`}</Text>
                  </View>
                </View>
                <View
                  style={{
                    width: "20%",
                    alignItems: "flex-end",
                  }}
                >
                 
                  <Menu w="190" trigger={triggerProps => {
                      return <Pressable accessibilityLabel="More " {...triggerProps}>
                              <MaterialCommunityIcons name={activeFilterIcon} size={24} color={'white'} />
                            </Pressable>;
                    }}>
                        
                        <Menu.Item
                          onPress={updateActiveFilterIcon("sort-alphabetical-ascending")}
                        >
                          <HStack alignItems={'center'} width={'100%'}>
                            <MaterialCommunityIcons name="sort-alphabetical-ascending" size={16} color={COLORS.blackGray} />
                            <Text style={{
                              fontSize: 16,
                              fontFamily: 'overpass-reg',
                              marginLeft: 5,
                              marginTop: 3,
                              color: COLORS.blackGray
                            }}>Bus name</Text>
                          </HStack>
                        </Menu.Item>

                        <Menu.Item
                          onPress={updateActiveFilterIcon("sort-numeric-variant")}
                        >
                          <HStack alignItems={'center'} width={'100%'}>
                            <MaterialCommunityIcons name="sort-numeric-variant" size={16} color={COLORS.blackGray} />
                            <Text style={{
                              fontSize: 16,
                              fontFamily: 'overpass-reg',
                              marginLeft: 5,
                              marginTop: 3,
                              color: COLORS.blackGray
                            }}>Bus fare</Text>
                          </HStack>
                        </Menu.Item>
                        <Menu.Item
                          onPress={updateActiveFilterIcon('clock-fast')}
                        >
                          <HStack alignItems={'center'} width={'100%'}>
                            <MaterialCommunityIcons name="clock-fast" size={16} color={COLORS.blackGray} />
                            <Text style={{
                              fontSize: 16,
                              fontFamily: 'overpass-reg',
                              marginLeft: 5,
                              marginTop: 3,
                              color: COLORS.blackGray
                            }}>Deparature time</Text>
                          </HStack>
                        </Menu.Item>
                        <Menu.Item
                          onPress={updateActiveFilterIcon('sort')}
                        >
                          <HStack alignItems={'center'} width={'100%'}>
                            <MaterialCommunityIcons name="delete" size={16} color={COLORS.danger} />
                            <Text style={{
                              fontSize: 16,
                              color: COLORS.danger,
                              fontFamily: 'overpass-reg',
                              marginLeft: 5,
                              marginTop: 3
                            }}>Clear filters</Text>
                          </HStack>
                        </Menu.Item>
                </Menu>
                  
                </View>
              </View>
            </View>
          </View>
        </View>
        <ScrollView
          style={{
            paddingVertical: 20,
          }}
        >
          {trips.map((value, index) => (
            <RouteCard key={index} metadata={value} />
          ))}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default memo(DetailsScreen);
