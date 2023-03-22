import {
  View,
  Text,
  SafeAreaView,
  ImageBackground,
  Animated,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import getPopularMovies from './action';
const {height, width} = Dimensions.get('screen');

const AnimatedHorzList = () => {
  const [listData, setListData] = useState([]);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const ref = useRef(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    getPopularMovies(setListData);
  }, []);

  console.log(listData);
  const onViewableItemsChanged = ({viewableItems, changed}: any) => {
    if (changed[0].isViewable) {
      const viewableIndex = viewableItems[0].index;
      console.log(viewableIndex);

      setCurrentIndex(viewableIndex);
    }
  };

  const viewabilityConfig = {
    waitForInteraction: true,
    itemVisiblePercentThreshold: 85,
  };
  const viewabilityConfigCallbackPairs = useRef([
    {viewabilityConfig, onViewableItemsChanged},
  ]);

  const renderMovies = ({item, index}: any) => {
    console.log(item);
    return (
      <Animated.View
        style={{
          ...styles.renderView,
          transform: [
            {
              translateY: animatedValue.interpolate({
                inputRange: [230 * (index - 1), 230 * index, 230 * (index + 1)],
                outputRange: [0, -80, 0],
                extrapolate: 'clamp',
              }),
            },
          ],
        }}>
        <Image
          style={styles.renderImage}
          source={{
            uri: `https://image.tmdb.org/t/p/w780${item?.poster_path}`,
          }}
        />
      </Animated.View>
    );
  };
  return (
    <SafeAreaView style={styles.main}>
      <ImageBackground
        style={{flex: 1, height: height, width: width}}
        blurRadius={16}
        source={{
          uri: `https://image.tmdb.org/t/p/w780${listData[currentIndex]?.poster_path}`,
        }}>
        <Animated.FlatList
          data={listData}
          ref={ref}
          horizontal
          renderItem={renderMovies}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.flatList}
          viewabilityConfigCallbackPairs={
            viewabilityConfigCallbackPairs.current
          }
          keyExtractor={(item: any, index: any) => index.toString()}
          onScrollEndDrag={() =>
            ref.current.scrollToIndex({
              index: currentIndex,
              animated: true,
            })
          }
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {
                    x: animatedValue,
                  },
                },
              },
            ],
            {useNativeDriver: true},
          )}
        />

        <View style={styles.detailView}>
          <Text numberOfLines={1} style={styles.titleText}>
            {listData[currentIndex]?.title}
          </Text>
          <Text numberOfLines={7} style={styles.detailText}>
            {listData[currentIndex]?.overview}
          </Text>
        </View>
        <View style={styles.numberDetail}>
          <View style={styles.ratingView}>
            <Image
              style={styles.starIcon}
              source={require('../../assets/icons/star.png')}
            />
            <Text style={styles.numText}>
              {listData[currentIndex]?.vote_average}
            </Text>
          </View>
          <Text style={styles.numText}>
            {listData[currentIndex]?.release_date}
          </Text>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  flatList: {
    marginTop: 100,
    marginLeft: 80,
    paddingRight: 150,
  },
  renderView: {
    width: 230,
    justifyContent: 'center',
    alignItems: 'center',
  },
  renderImage: {
    backgroundColor: 'powderblue',
    height: 300,
    width: 200,
  },
  detailView: {
    alignSelf: 'center',
    height: 200,
    width: '80%',
  },
  titleText: {
    textAlign: 'center',
    color: 'white',

    fontSize: 24,
    fontWeight: '600',
  },
  detailText: {
    marginTop: 10,
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
  numberDetail: {
    flexDirection: 'row',
    width: '80%',
    alignSelf: 'center',
    justifyContent: 'space-between',
  },
  ratingView: {
    flexDirection: 'row',
  },
  starIcon: {
    height: 20,
    width: 20,
  },
  numText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default AnimatedHorzList;
