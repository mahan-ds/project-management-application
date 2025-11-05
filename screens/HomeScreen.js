import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Button, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ProjectCard from '../components/ProjectCard';
import { getProjects, saveProjects } from '../utils/storage';

export default function HomeScreen({ navigation }) {
  const [projects, setProjects] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Deadline');
  const [nowTs, setNowTs] = useState(Date.now());

  useEffect(() => {
    const load = async () => setProjects(await getProjects());
    const unsubscribe = navigation.addListener('focus', load);
    const dataInterval = setInterval(load, 10000); // refresh data periodically
    const tick = setInterval(() => setNowTs(Date.now()), 1000); // UI tick for time progress
    return () => { unsubscribe(); clearInterval(dataInterval); clearInterval(tick); };
  }, [navigation]);

  const deleteProject = async (id) => {
    const updated = projects.filter(p => p.id !== id);
    setProjects(updated);
    await saveProjects(updated);
  };

  const handleAdd = () => {
    if (projects.length >= 5) {
      Alert.alert("🚫 محدودیت نسخه رایگان", "برای افزودن بیش از ۵ پروژه باید اشتراک ماهانه فعال کنید.");
      return;
    }
    navigation.navigate('NewProject');
  };

  const filteredSorted = useMemo(() => {
    let list = [...projects];
    if (statusFilter !== 'All') list = list.filter(p => (p.status || 'Not Started') === statusFilter);
    if (sortBy === 'Deadline') {
      list.sort((a, b) => new Date(a.endDate || 0) - new Date(b.endDate || 0));
    } else if (sortBy === 'Name') {
      list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }
    return list;
  }, [projects, statusFilter, sortBy]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>پروژه‌های من</Text>

      <View style={styles.filtersRow}>
        <Text>فیلتر وضعیت:</Text>
        {['All', 'Not Started', 'In Progress', 'Completed'].map((s) => (
          <TouchableOpacity key={s} onPress={() => setStatusFilter(s)} style={[styles.chip, statusFilter === s && styles.chipActive]}>
            <Text style={statusFilter === s ? styles.chipActiveText : undefined}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.filtersRow}>
        <Text>مرتب‌سازی:</Text>
        {['Deadline', 'Name'].map((s) => (
          <TouchableOpacity key={s} onPress={() => setSortBy(s)} style={[styles.chip, sortBy === s && styles.chipActive]}>
            <Text style={sortBy === s ? styles.chipActiveText : undefined}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredSorted}
        keyExtractor={(item) => item.id.toString()}
        extraData={nowTs}
        renderItem={({ item }) => (
          <ProjectCard item={item} onPress={() => navigation.navigate('ProjectDetail', { project: item })} onDelete={deleteProject} />
        )}
      />

      <Button title="➕ افزودن پروژه" onPress={handleAdd} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  filtersRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 10 },
  chip: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 12, borderWidth: 1, borderColor: '#ccc', marginHorizontal: 4 },
  chipActive: { backgroundColor: '#222', borderColor: '#222' },
  chipActiveText: { color: '#fff' },
});
