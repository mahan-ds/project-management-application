import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { addProject } from '../utils/storage';

export default function NewProject({ navigation }) {
  const [name, setName] = useState('');
  const [budget, setBudget] = useState('');
  const [clientName, setClientName] = useState('');
  const [startDate, setStartDate] = useState(''); // YYYY-MM-DD
  const [endDate, setEndDate] = useState(''); // YYYY-MM-DD
  const [description, setDescription] = useState('');
  const [estimatedHours, setEstimatedHours] = useState('');
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const formatYMD = (d) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const saveProject = async () => {
    if (!name.trim()) {
      Alert.alert('خطا', 'نام پروژه را وارد کنید.');
      return;
    }
    const budgetNum = Number(budget) || 0;
    const newProject = {
      id: Date.now(),
      name: name.trim(),
      budget: budgetNum,
      clientName: clientName.trim(),
      startDate: startDate.trim(),
      endDate: endDate.trim(),
      description: description.trim(),
      estimatedHours: Number(estimatedHours) > 0 ? Number(estimatedHours) : 1,
      status: 'Not Started',
      tasks: [],
      notes: [],
      time: 0,
    };
    await addProject(newProject);
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>افزودن پروژه جدید</Text>
      <TextInput style={styles.input} placeholder="نام پروژه" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="نام مشتری" value={clientName} onChangeText={setClientName} />
      <TextInput style={styles.input} placeholder="بودجه (تومان)" value={budget} onChangeText={setBudget} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="زمان تخمینی (ساعت)" value={estimatedHours} onChangeText={setEstimatedHours} keyboardType="numeric" />

      <TouchableOpacity style={styles.input} onPress={() => setShowStartPicker(true)}>
        <Text style={{ color: startDate ? '#000' : '#999' }}>{startDate || 'تاریخ شروع را انتخاب کنید'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.input} onPress={() => setShowEndPicker(true)}>
        <Text style={{ color: endDate ? '#000' : '#999' }}>{endDate || 'تاریخ پایان را انتخاب کنید'}</Text>
      </TouchableOpacity>

      {showStartPicker && (
        <DateTimePicker
          value={startDate ? new Date(startDate) : new Date()}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowStartPicker(false);
            if (date) setStartDate(formatYMD(date));
          }}
        />
      )}
      {showEndPicker && (
        <DateTimePicker
          value={endDate ? new Date(endDate) : new Date()}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowEndPicker(false);
            if (date) setEndDate(formatYMD(date));
          }}
        />
      )}
      <TextInput style={[styles.input, styles.textarea]} placeholder="توضیحات پروژه" value={description} onChangeText={setDescription} multiline />
      <Button title="ثبت پروژه" onPress={saveProject} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, borderRadius: 10, padding: 10, marginBottom: 10, borderColor: '#ccc' },
  textarea: { height: 120, textAlignVertical: 'top' },
});
