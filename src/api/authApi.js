import axiosInstance from './axiosInstance';

export const loginApi = async ({ email, password }) => {
  try {
    const response = await axiosInstance.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('access_token', response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const signupApi = async (userData) => {
  try {
    const response = await axiosInstance.post('/auth/signup', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logoutApi = async () => {
  try {
    await axiosInstance.post('/auth/logout');
    localStorage.removeItem('access_token');
  } catch (error) {
    // 로그아웃 실패시에도 토큰은 삭제
    localStorage.removeItem('access_token');
    throw error;
  }
}; 