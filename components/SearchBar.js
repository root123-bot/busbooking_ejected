import React, { useRef, useEffect, memo, useContext, useState } from "react";
import { View, ActivityIndicator, StatusBar, StyleSheet } from "react-native";
import { Searchbar } from "react-native-paper";
import { AppContext } from "../store/context";
import { COLORS } from "../constants/colors";

function SearchComponent({ searchQueryHandler }) {
  const AppCtx = useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <View>
      <Searchbar
        placeholder="Search route"
        mode="bar"
        icon={AppCtx.favIcon}
        onIconPress={() => {
          if (AppCtx.favIcon === "heart-outline") {
            AppCtx.manipulateFavIcon("heart");
            AppCtx.manipulateToggleFavorite(true);
          } else if (AppCtx.favIcon === "heart") {
            AppCtx.manipulateFavIcon("heart-outline");
            AppCtx.manipulateToggleFavorite(false);
          }
        }}
        placeholderTextColor={COLORS.darkprimary}
        elevation={2}
        iconColor={COLORS.darkprimary}
        value={searchQuery}
        style={{
          borderRadius: 10,
          backgroundColor: "#fff",
        }}
        inputStyle={{
          fontFamily: "montserrat-17",
          color: "grey",
        }}
        onChangeText={(query) => {
          searchQueryHandler(query);
          setSearchQuery(query);
        }}
      />
    </View>
  );
}

export default memo(SearchComponent);
