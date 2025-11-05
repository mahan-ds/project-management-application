import React from 'react';
import { Button, StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function ProjectCard({ item, onPress, onDelete }) {
  const tasks = Array.isArray(item.tasks) ? item.tasks : [];
  const completed = tasks.filter(t => t.completed).length;
  const total = tasks.length || 1;
  const progressPct = Math.round((completed / total) * 100);
  const startStr = item.startDate ? new Date(item.startDate).toISOString().slice(0, 10) : '—';
  const endStr = item.endDate ? new Date(item.endDate).toISOString().slice(0, 10) : '—';

  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      <Text>وضعیت: {item.status || 'Not Started'}</Text>
      <Text>شروع: {startStr}</Text>
      <Text>پایان: {endStr}</Text>
      <Text>پیشرفت چک‌لیست: {progressPct}% ({completed}/{tasks.length || 0})</Text>
      <Text>💰 بودجه: {item.budget} تومان</Text>
      <Text>⏱ زمان: {(item.time / 3600).toFixed(2)} ساعت</Text>
      <Button title="❌ حذف" color="red" onPress={() => onDelete(item.id)} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { padding: 15, borderRadius: 10, borderWidth: 1, marginBottom: 10, borderColor: '#ccc' },
  name: { fontWeight: 'bold', fontSize: 18 },
});

// removed time progress bar per requirements
