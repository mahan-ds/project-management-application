import React, { useEffect, useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { cancelNotifications } from '../utils/notifications';
import { addProjectNote, addTaskToProject, getProjects, updateProject, updateTaskInProject } from '../utils/storage';

export default function ProjectDetail({ route, navigation }) {
  const { project } = route.params;
  const [current, setCurrent] = useState(project);
  const [taskDesc, setTaskDesc] = useState('');
  const [taskDue, setTaskDue] = useState('');
  const [projectNote, setProjectNote] = useState('');
  // removed time progress logic

  const reload = async () => {
    const list = await getProjects();
    const found = list.find(p => p.id === project.id);
    if (found) setCurrent(found);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', reload);
    return unsubscribe;
  }, [navigation]);

  const startProject = async () => {
    Alert.alert(
      'شروع پروژه',
      'Are you sure you want to start this project?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          onPress: async () => {
            const updated = await updateProject(project.id, () => ({ status: 'In Progress' }));
            if (updated) setCurrent(updated);
            // keep notifications if you still want based on endDate
            await reload();
          },
        },
      ]
    );
  };

  const completeProject = async () => {
    await updateProject(project.id, () => ({ status: 'Completed' }));
    try { await cancelNotifications(current.notificationIds || []); } catch (_) {}
    await reload();
  };

  const addTask = async () => {
    if (!taskDesc.trim()) {
      Alert.alert('خطا', 'شرح کار را وارد کنید.');
      return;
    }
    const task = { id: Date.now(), description: taskDesc.trim(), dueDate: taskDue.trim(), completed: false, notes: [] };
    await addTaskToProject(project.id, task);
    setTaskDesc('');
    setTaskDue('');
    await reload();
  };

  const toggleTask = async (taskId, done) => {
    await updateTaskInProject(project.id, taskId, () => ({ completed: done }));
    await reload();
  };

  const addNote = async () => {
    if (!projectNote.trim()) return;
    await addProjectNote(project.id, projectNote.trim());
    setProjectNote('');
    await reload();
  };

  const tasks = Array.isArray(current.tasks) ? current.tasks : [];
  const completedCount = tasks.filter(t => t.completed).length;
  const progressPct = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;

  // removed remaining time and progress calculations


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.name}>{current.name}</Text>
      <Text>مشتری: {current.clientName || '—'}</Text>
      <Text>وضعیت: {current.status}</Text>
      <Text>شروع: {current.startDate || '—'} | پایان: {current.endDate || '—'}</Text>
      <Text>توضیحات: {current.description || '—'}</Text>

      {/* removed progress bar section */}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>کنترل وضعیت پروژه</Text>
        {current.status !== 'In Progress' && (
          <Button title="🚀 شروع پروژه" onPress={startProject} />
        )}
        {current.status !== 'Completed' && (
          <View style={{ height: 8 }} />
        )}
        {current.status !== 'Completed' && (
          <Button title="✅ اتمام پروژه" onPress={completeProject} />
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>کارها ({completedCount}/{tasks.length}) - پیشرفت {progressPct}%</Text>
        <View style={styles.row}>
          <TextInput style={[styles.input, { flex: 1 }]} placeholder="شرح کار" value={taskDesc} onChangeText={setTaskDesc} />
          <View style={{ width: 8 }} />
          <TextInput style={[styles.input, { width: 150 }]} placeholder="موعد (YYYY-MM-DD)" value={taskDue} onChangeText={setTaskDue} />
        </View>
        <Button title="➕ افزودن کار" onPress={addTask} />

        <View style={{ marginTop: 10 }}>
          {tasks.map((t) => (
            <View key={t.id} style={styles.taskItem}>
              <TouchableOpacity onPress={() => toggleTask(t.id, !t.completed)} style={[styles.checkbox, t.completed && styles.checkboxOn]} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.taskText, t.completed && styles.taskDone]}>{t.description}</Text>
                <Text style={styles.taskMeta}>موعد: {t.dueDate || '—'}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>یادداشت‌ها</Text>
        <TextInput style={[styles.input, styles.textarea]} placeholder="یادداشت جدید..." value={projectNote} onChangeText={setProjectNote} multiline />
        <Button title="➕ افزودن یادداشت" onPress={addNote} />
        {Array.isArray(current.notes) && current.notes.map((n, idx) => (
          <Text key={idx} style={styles.noteItem}>• {n}</Text>
        ))}
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, gap: 12 },
  name: { fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
  section: { marginTop: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center' },
  input: { borderWidth: 1, borderRadius: 10, padding: 10, borderColor: '#ccc', marginBottom: 10 },
  textarea: { height: 100, textAlignVertical: 'top' },
  taskItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderColor: '#eee', gap: 10 },
  checkbox: { width: 22, height: 22, borderRadius: 4, borderWidth: 1, borderColor: '#888' },
  checkboxOn: { backgroundColor: '#4caf50', borderColor: '#4caf50' },
  taskText: { fontSize: 16 },
  taskDone: { textDecorationLine: 'line-through', color: '#777' },
  taskMeta: { color: '#666', marginTop: 2, fontSize: 12 },
  noteItem: { marginTop: 6, color: '#333' },
  // removed progress styles
});
