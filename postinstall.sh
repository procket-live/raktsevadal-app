node ./node_modules/@mauron85/react-native-background-geolocation/scripts/postlink.js
npx jetify
sed -i '' -e 's/sourceCompatibility JavaVersion.VERSION_1_6//g' ./node_modules/@mauron85/react-native-background-geolocation/android/common/build.gradle
sed -i '' -e 's/targetCompatibility JavaVersion.VERSION_1_6//g' ./node_modules/@mauron85/react-native-background-geolocation/android/common/build.gradle
sed -i '' -e "41s/\${safeExtGet('googlePlayServicesVersion', '17.0.0')}/17.0.0/g" ./node_modules/react-native-android-location-enabler/android/build.gradle
sed -i '' -e "13s/ViewPagerAndroid,//g" ./node_modules/react-native-scrollable-tab-view/index.js
sed -i '' -e "17s/^$/const ViewPagerAndroid = require('@react-native-community\/viewpager')/g" ./node_modules/react-native-scrollable-tab-view/index.js