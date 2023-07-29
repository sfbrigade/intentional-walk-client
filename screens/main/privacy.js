import React, {useState} from 'react';
import {SafeAreaView, ScrollView, View} from 'react-native';
import Autolink from 'react-native-autolink';
import {PageTitle} from '../../components';
import {GlobalStyles} from '../../styles';
import {Strings} from '../../lib';

import Privacy from '../../assets/privacy';

export default function PrivacyScreen() {
  return (
    <SafeAreaView style={GlobalStyles.container}>
      <ScrollView>
        <View style={GlobalStyles.content}>
          <PageTitle title={Strings.common.privacyPolicy} />
          <View style={GlobalStyles.content}>
            <Autolink text={Privacy[Strings.getLanguage()]} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
