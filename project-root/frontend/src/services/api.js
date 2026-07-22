import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function getStaff() {
  const response = await api.get('/staff');
  return response.data;
}

export async function getStaffById(id) {
  const response = await api.get(`/staff/${id}`);
  return response.data;
}

export async function getInterests(staffId) {
  const response = await api.get(`/staff/${staffId}/interests`);
  return response.data;
}

export async function getProjects(staffId) {
  const response = await api.get(`/staff/${staffId}/projects`);
  return response.data;
}

export async function addInterest(payload) {
  const response = await api.post('/staff/interest', payload);
  return response.data;
}

export async function updateInterest(id, payload) {
  const response = await api.put(`/staff/interest/${id}`, payload);
  return response.data;
}

export async function deleteInterest(id) {
  const response = await api.delete(`/staff/interest/${id}`);
  return response.data;
}

export async function addProject(payload) {
  const response = await api.post('/staff/project', payload);
  return response.data;
}

export async function updateProject(id, payload) {
  const response = await api.put(`/staff/project/${id}`, payload);
  return response.data;
}

export async function deleteProject(id) {
  const response = await api.delete(`/staff/project/${id}`);
  return response.data;
}

export default api;