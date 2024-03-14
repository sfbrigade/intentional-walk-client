import React, {useEffect, useState} from 'react';
import {SafeAreaView, ScrollView, View} from 'react-native';
import Autolink from 'react-native-autolink';
import {PageTitle} from '../../components';
import {GlobalStyles} from '../../styles';
import {Realm, Strings} from '../../lib';
import moment from 'moment';

import ContestRules from '../../assets/contestRules';

export default function ContestRulesScreen() {
  const [contest, setContest] = useState(null);

  useEffect(() => {
    Realm.getContest().then(newContest => setContest(newContest?.toObject()));
  }, []);

  let from = '';
  let to = '';
  if (contest) {
    from = moment(contest.start).format(Strings.common.dateSlash);
    to = moment(contest.end).format(Strings.common.dateSlash);
  }

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <ScrollView>
        <View style={GlobalStyles.content}>
          <PageTitle title={Strings.common.contestRules} />
          <View style={GlobalStyles.content}>
            <Autolink
              text={Strings.formatString(
                ContestRules[Strings.getLanguage()],
                from,
                to,
              )}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
