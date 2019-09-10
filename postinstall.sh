node ./node_modules/@mauron85/react-native-background-geolocation/scripts/postlink.js
sed -i '' -e 's/sourceCompatibility JavaVersion.VERSION_1_6//g' ./node_modules/@mauron85/react-native-background-geolocation/android/common/build.gradle
sed -i '' -e 's/targetCompatibility JavaVersion.VERSION_1_6//g' ./node_modules/@mauron85/react-native-background-geolocation/android/common/build.gradle