# Intentional Walk

This is the new Intentional Walk iOS and Android client app codebase.

# Getting Started

> **Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

## Setting up an environment

Copy one of the environment files in the project root directory (`.env.dev`, `.env.staging`, `.env.prod`) to `.env` depending upon which environment you wish to connect to. Note: currently, there are no "secrets" in our environment variables, but please DO NOT COMMIT secrets into any of the environment files. Instead, put a blank/empty placeholder, and store the value in a corresponding `.local` file which will be ignored by git (i.e. `.env.dev.local`, `.env.staging.local`, `.env.prod.local`).

To start, use the `.env.staging` environment. Note that the staging server may go to sleep and take
some seconds to start up again when connecting. The `.env.dev` environment is for developers who
are also running the server codebase on the same machine and wish to connect to it. The
`.env.prod` environment connects to the live production server. Please sign up with either the
first and/or last name "Tester" to have your account flagged as a test account on production.

If you change your environment settings, you'll need to reset the Metro Bundler cache. Close it, if
it is running, then restart it with: `npm start -- --reset-cache`

## Step 1: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# Using npm
npm start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Deploying Releases

## Step 1: Set up necessary credentials

Contact another developer or admin on this project and:

- Share the email address associated with an Apple ID that you will use to log in to the Apple Developer Program website. You will be invited to the developer team.

  - In the `ios` directory, copy `example.env` to `.env` and set the email address associated with your Apple ID registered with the Apple Developer Program.

  - Once you accept the invite, log in to the [Apple Developer](https://developer.apple.com/) website to download and install Xcode.

- Share the email address associated with a Google Account that you will use to log in to the Google Play Console. You will then get the files and password to do the following:

  - In the `android` directory, copy `example.env` to `.env` and set the password for the production signing keystore.

  - In the `android/app` directory, save a copy of the `intentional-walk-upload-key.keystore` production signing keystore.

  - In the `android/fastlane` directory, save a copy of the `key.json` for the Google Play service account used to automate release uploads.

## Step 2: Set up command-line tools

- In the root of the project, run `bundle` to install the deployment tools.

# Troubleshooting

If you can't get this to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
