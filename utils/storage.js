import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveData = async (key, data) => {
  await AsyncStorage.setItem(key, JSON.stringify(data));
};

export const getData = async (key) => {
  const value = await AsyncStorage.getItem(key);
  return value ? JSON.parse(value) : [];
};

// Project data model helpers
// project: {
//   id, name, budget, clientName, startDate, endDate, description,
//   status: 'Not Started' | 'In Progress' | 'Completed',
//   time, tasks: [{ id, description, dueDate, completed, notes: string[] }],
//   notes: string[], createdAt, updatedAt, notificationIds?: string[]
// }

export const getProjects = async () => {
  const projects = await getData('projects');
  if (!Array.isArray(projects)) return [];
  return projects.map((p) => ({
    id: p.id,
    name: p.name || '',
    budget: p.budget || 0,
    clientName: p.clientName || '',
    startDate: p.startDate || '',
    endDate: p.endDate || '',
    description: p.description || '',
    status: p.status || 'Not Started',
    time: typeof p.time === 'number' ? p.time : 0,
    tasks: Array.isArray(p.tasks) ? p.tasks : [],
    notes: Array.isArray(p.notes) ? p.notes : [],
    createdAt: p.createdAt || Date.now(),
    updatedAt: p.updatedAt || Date.now(),
    notificationIds: Array.isArray(p.notificationIds) ? p.notificationIds : [],
    startedAtTs: typeof p.startedAtTs === 'number' ? p.startedAtTs : null,
  }));
};

export const saveProjects = async (projects) => {
  await saveData('projects', projects);
};

export const addProject = async (project) => {
  const projects = await getProjects();
  projects.push({
    ...project,
    status: project.status || 'Not Started',
    tasks: project.tasks || [],
    notes: project.notes || [],
    time: project.time || 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    notificationIds: project.notificationIds || [],
  });
  await saveProjects(projects);
  return project;
};

export const updateProject = async (projectId, updater) => {
  const projects = await getProjects();
  const updated = projects.map((p) =>
    p.id === projectId ? { ...p, ...updater(p), updatedAt: Date.now() } : p
  );
  await saveProjects(updated);
  return updated.find((p) => p.id === projectId);
};

export const addTaskToProject = async (projectId, task) => {
  return updateProject(projectId, (p) => ({ tasks: [...(p.tasks || []), task] }));
};

export const updateTaskInProject = async (projectId, taskId, updater) => {
  return updateProject(projectId, (p) => ({
    tasks: (p.tasks || []).map((t) => (t.id === taskId ? { ...t, ...updater(t) } : t)),
  }));
};

export const addProjectNote = async (projectId, note) => {
  return updateProject(projectId, (p) => ({ notes: [note, ...(p.notes || [])] }));
};
