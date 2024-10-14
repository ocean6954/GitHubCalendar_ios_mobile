import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {fetchData} from './src/services/api';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {Week, Contribution, ContributionDay} from './src/type';
import {testWeeksData} from './test';

const testData = testWeeksData;
// const formatContributionsToWeeks = (contributions: Contribution[]): Week[] => {
//   const weeksMap: Record<string, ContributionDay[]> = {};

//   contributions.forEach(contribution => {
//     const weekStart = getWeekStart(contribution.date); // 日付を週ごとにグループ化
//     if (!weeksMap[weekStart]) {
//       weeksMap[weekStart] = [];
//     }
//     weeksMap[weekStart].push({
//       date: contribution.date,
//       contributionCount: contribution.contributionCount,
//     });
//   });

//   return Object.keys(weeksMap).map(weekStart => ({
//     contributionDays: weeksMap[weekStart],
//   }));
// };

// 週の開始日を取得するヘルパー関数
// const getWeekStart = (date: string): string => {
//   const d = new Date(date);
//   const day = d.getDay();
//   const diff = d.getDate() - day + (day === 0 ? -6 : 1);
//   const weekStart = new Date(d.setDate(diff));
//   return weekStart.toISOString().split('T')[0]; // YYYY-MM-DD形式で返す
// };

const GitHubCalendar = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [calendarData, setCalendarData] = useState<Week[]>([]);
  const [username, setUsername] = useState('');
  const [period, setPeriod] = useState('6months');

  const handleSubmit = async () => {
    if (username) {
      const weeks = await fetchData(username, period);
      console.log('weeks is', weeks);
      setCalendarData(weeks);
    }
  };

  const handlePeriodChange = async (value: string) => {
    setPeriod(value);
    if (username) {
      const weeks = await fetchData(username, value);
      setCalendarData(weeks);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Enter GitHub username"
          value={username}
          onChangeText={text => setUsername(text)}
          autoCapitalize="none"
        />
        <Button title="Load Contributions" onPress={handleSubmit} />
      </View>

      <Text>期間を選択:</Text>
      <Picker
        selectedValue={period}
        style={styles.picker}
        onValueChange={value => handlePeriodChange(value)}>
        <Picker.Item label="3ヶ月" value="3months" />
        <Picker.Item label="半年" value="6months" />
        <Picker.Item label="1年" value="1year" />
      </Picker>

      {/* <View style={styles.calendar}>
        {calendarData.map((week, weekIndex) => (
          <View key={weekIndex} style={styles.week}>
            {week.contributionDays.map((day, dayIndex) => {
              // 日付やコントリビューションのデータをコンソールに出力
              return (
                <View
                  key={dayIndex}
                  style={[
                    styles.day,
                    {
                      backgroundColor: getColorForContribution(
                        day.contributionCount,
                      ),
                    },
                  ]}>
                  <Text style={styles.tooltip}>
                    {`${day.date}: ${day.contributionCount}`}
                  </Text>
                </View>
              );
            })}
          </View>
        ))}
      </View> */}

      <View style={styles.calendar}>
        <View>テストデータ</View>
        {testData.map((week, weekIndex) => (
          <View key={weekIndex} style={styles.week}>
            {week.contributionDays.map((day, dayIndex) => {
              // 日付やコントリビューションのデータをコンソールに出力
              return (
                <View
                  key={dayIndex}
                  style={[
                    styles.day,
                    {
                      backgroundColor: getColorForContribution(
                        day.contributionCount,
                      ),
                    },
                  ]}>
                  <Text style={styles.tooltip}>
                    {`${day.date}: ${day.contributionCount}`}
                  </Text>
                </View>
              );
            })}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const getColorForContribution = (count: number) => {
  if (count >= 8) {
    return '#216e39';
  }
  if (count >= 5) {
    return '#30a14e';
  }
  if (count >= 3) {
    return '#40c463';
  }
  if (count >= 1) {
    return '#9BE9A8';
  }
  return '#ebedf0';
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    padding: 20,
    alignItems: 'center',
  },
  form: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 10,
    flex: 1,
    marginRight: 10,
  },
  picker: {
    height: 50,
    width: 150,
    marginBottom: 20,
  },
  calendar: {
    flexDirection: 'row',
  },
  week: {
    flexDirection: 'column',
    marginBottom: 5,
  },
  day: {
    width: 20,
    height: 20,
    marginRight: 2,
    marginBottom: 2,
  },
  tooltip: {
    fontSize: 10,
    color: '#fff',
    textAlign: 'center',
  },
});

export default GitHubCalendar;
