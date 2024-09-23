rm -rf examples/expo-test/advents-react-native
rm -rf examples/react-native-test/advents-react-native
pnpm build
mkdir -p examples/expo-test/advents-react-native
mkdir -p examples/react-native-test/advents-react-native
cp -R dist/* examples/expo-test/advents-react-native
cp -R dist/* examples/react-native-test/advents-react-native
