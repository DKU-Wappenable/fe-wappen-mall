import axiosInstance from '../axiosInstance';

/**
 * 사용자 관련 API 서비스
 * 백엔드의 User API와 연동하는 함수들을 제공
 */
export const userService = {
  /**
   * 회원가입
   * @param {Object} signupData - 회원가입 정보
   * @param {string} signupData.email - 이메일
   * @param {string} signupData.password - 비밀번호
   * @param {string} signupData.name - 이름
   * @param {string} signupData.recoveryEmail - 복구 이메일
   * @returns {Promise<string>} 성공 메시지
   */
  signup: async (signupData) => {
    const response = await axiosInstance.post('/users/signup', signupData);
    return response.data;
  },

  /**
   * 로그인
   * @param {Object} loginData - 로그인 정보
   * @param {string} loginData.email - 이메일
   * @param {string} loginData.password - 비밀번호
   * @returns {Promise<Object>} JWT 토큰 정보
   */
  login: async (loginData) => {
    const response = await axiosInstance.post('/users/login', loginData);
    
    // 로그인 성공 시 토큰을 localStorage에 저장
    if (response.data.accessToken) {
      localStorage.setItem('access_token', response.data.accessToken);
    }
    
    return response.data;
  },

  /**
   * 로그아웃 (로컬 토큰 제거)
   * @returns {void}
   */
  logout: () => {
    localStorage.removeItem('access_token');
    // 추가적인 로그아웃 로직이 필요한 경우 여기에 구현
  },

  /**
   * 회원탈퇴 (인증 필요)
   * @returns {Promise<string>} 탈퇴 결과 메시지
   */
  deleteAccount: async () => {
    const response = await axiosInstance.delete('/users');
    
    // 회원탈퇴 성공 시 토큰 제거
    localStorage.removeItem('access_token');
    
    return response.data;
  },

  /**
   * 아이디(이메일) 찾기
   * @param {string} recoveryEmail - 복구 이메일
   * @returns {Promise<string>} 찾은 이메일
   */
  findEmail: async (recoveryEmail) => {
    const response = await axiosInstance.post('/users/find-id', {
      recoveryEmail
    });
    return response.data;
  },

  /**
   * 비밀번호 찾기/초기화
   * @param {Object} findPasswordData - 비밀번호 찾기 정보
   * @param {string} findPasswordData.email - 이메일
   * @param {string} findPasswordData.recoveryEmail - 복구 이메일
   * @returns {Promise<string>} 임시 비밀번호
   */
  findPassword: async (findPasswordData) => {
    const response = await axiosInstance.post('/users/find-pw', findPasswordData);
    return response.data;
  },

  /**
   * 비밀번호 재설정 (인증 필요)
   * @param {Object} resetPasswordData - 비밀번호 재설정 정보
   * @param {string} resetPasswordData.currentPassword - 현재 비밀번호
   * @param {string} resetPasswordData.newPassword - 새 비밀번호
   * @returns {Promise<string>} 성공 메시지
   */
  resetPassword: async (resetPasswordData) => {
    const response = await axiosInstance.post('/users/reset-password', resetPasswordData);
    return response.data;
  },

  /**
   * 현재 로그인 상태 확인
   * @returns {boolean} 로그인 여부
   */
  isLoggedIn: () => {
    const token = localStorage.getItem('access_token');
    return !!token;
  },

  /**
   * 저장된 JWT 토큰 가져오기
   * @returns {string|null} JWT 토큰
   */
  getToken: () => {
    return localStorage.getItem('access_token');
  },
}; 