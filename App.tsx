/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {fetchData, postRailsData} from './src/services/api';

import {ContributionRails, Weeks} from './src/type';
import axios from 'axios';

const GitHubCalendar = () => {
  const [calendarData, setCalendarData] = useState<Weeks>();
  const [username, setUsername] = useState('');
  const [period, setPeriod] = useState('6months');
  const [contributionsRails, setContributionsRails] = useState<
    ContributionRails[]
  >([]);

  const getContribution = async () => {
    if (username) {
      const weeks = await fetchData(username, period);
      console.log('weeksは', JSON.stringify(weeks, null, 2));
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

  // 週の開始日を取得するヘルパー関数;
  const getWeekStart = (date: string): string => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const weekStart = new Date(d.setDate(diff));
    return weekStart.toISOString().split('T')[0]; // YYYY-MM-DD形式で返す
  };

  const formatRailsData = (data: ContributionRails[]) => {
    const weeksMap: Record<string, ContributionRails[]> = {};

    data.forEach(contribution => {
      const weekStart = getWeekStart(contribution.date); // 日付を週ごとにグループ化
      if (!weeksMap[weekStart]) {
        weeksMap[weekStart] = [];
      }
      weeksMap[weekStart].push({
        date: contribution.date,
        contribution_count: contribution.contribution_count,
      });
    });

    return Object.keys(weeksMap).map(weekStart => ({
      contributionDays: weeksMap[weekStart],
    }));
  };

  const getRailsData = () => {
    const fetchRailsData = async () => {
      try {
        const response = await axios.get(
          'http://127.0.0.1:3000/api/contributions',
        );
        setContributionsRails(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRailsData();
  };

  const handleSubmit = () => {
    postRailsData(calendarData);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="GitHubのユーザー名を入れてください!"
          value={username}
          onChangeText={text => setUsername(text)}
          autoCapitalize="none"
        />
        <Button title="Load Contributions" onPress={getContribution} />
      </View>

      <View style={styles.pickerContainer}>
        <Text style={styles.text}>期間を選択:</Text>
        <Picker
          selectedValue={period}
          style={styles.picker}
          onValueChange={value => handlePeriodChange(value)}>
          <Picker.Item label="3ヶ月" value="3months" />
          <Picker.Item label="半年" value="6months" />
          <Picker.Item label="1年" value="1year" />
        </Picker>
        <Button title="データ登録" onPress={handleSubmit} />
      </View>

      <Button title="Railsからデータ取得" onPress={getRailsData} />

      {contributionsRails && (
        <View style={styles.calendarRails}>
          {formatRailsData(contributionsRails).map((week, weekIndex) => (
            <View key={weekIndex} style={styles.week}>
              {week.contributionDays.map((day, dayIndex) => {
                return (
                  <View
                    key={dayIndex}
                    style={[
                      styles.day,
                      {
                        backgroundColor: getColorForContribution(
                          day.contribution_count,
                        ),
                      },
                    ]}>
                    <Text style={styles.tooltip}>
                      {`${day.date}: ${day.contribution_count}`}
                    </Text>
                  </View>
                );
              })}
            </View>
          ))}
        </View>
      )}

      {calendarData && (
        <View style={styles.calendar}>
          {calendarData.map((week, weekIndex) => (
            <View key={weekIndex} style={styles.week}>
              {week.contributionDays.map((day, dayIndex) => {
                return (
                  <View
                    key={dayIndex}
                    style={[
                      styles.day,
                      {
                        backgroundColor: getColorForContribution(
                          day.contribution_count,
                        ),
                      },
                    ]}>
                    <Text style={styles.tooltip}>
                      {`${day.date}: ${day.contribution_count}`}
                    </Text>
                  </View>
                );
              })}
            </View>
          ))}
        </View>
      )}
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
  text: {
    fontSize: 16,
  },
  container: {
    marginTop: 20,
    padding: 20,
    alignItems: 'center',
    // backgroundColor: '#f9f9f9',
    backgroundColor: 'red',
    height: '100%',
  },
  form: {
    flexDirection: 'row',
    margin: 40,
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center', // 中央揃え
    backgroundColor: 'blue',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 10,
    flex: 1,
    marginRight: 10,
    borderRadius: 5, // 角を丸く
    backgroundColor: '#fff',
  },
  pickerContainer: {
    width: '80%',
    backgroundColor: 'orange',
    alignItems: 'center',
    marginBottom: 40,
  },
  picker: {
    width: 150,
    // marginBottom: 20,
    borderRadius: 5, // ピッカーの角を丸く
    backgroundColor: '#fff', // 背景を白に
  },
  calendarRails: {
    flexDirection: 'row',
    flexWrap: 'wrap', // 要素を折り返すように変更
    justifyContent: 'center', // 中央揃え
    padding: 10,
    marginTop: 40,
    backgroundColor: '#fff',

    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // 影を追加
  },

  calendar: {
    flexDirection: 'row',
    flexWrap: 'wrap', // 要素を折り返すように変更
    justifyContent: 'center', // 中央揃え
    padding: 10,
    marginTop: 40,
    backgroundColor: 'gray',

    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // 影を追加
  },
  week: {
    flexDirection: 'column', // カラムからロウへ変更
    marginBottom: 5,
    justifyContent: 'center',
  },
  day: {
    width: 20,
    height: 20,
    marginRight: 2,
    marginBottom: 2,
    borderRadius: 4, // 丸みを追加
    backgroundColor: '#e0e0e0', // デフォルトの背景色
  },
  tooltip: {
    fontSize: 10,
    color: '#fff',
    textAlign: 'center',
  },
});

export default GitHubCalendar;
