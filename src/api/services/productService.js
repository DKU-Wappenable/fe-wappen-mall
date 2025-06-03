import axiosInstance from '../axiosInstance';

/**
 * 상품 관련 API 서비스
 * 백엔드의 Product API와 연동하는 함수들을 제공
 */
export const productService = {
  /**
   * 상품 목록 조회 (페이지네이션, 검색, 정렬 지원)
   * @param {Object} params - 조회 조건
   * @param {string} params.keyword - 검색 키워드 (선택)
   * @param {string} params.sortBy - 정렬 기준 (기본값: 'createdAt')
   * @param {string} params.direction - 정렬 방향 (기본값: 'desc')
   * @param {number} params.page - 페이지 번호 (기본값: 0)
   * @param {number} params.size - 페이지 크기 (기본값: 20)
   * @returns {Promise<Object>} 페이지네이션된 상품 목록
   */
  getProducts: async (params = {}) => {
    const {
      keyword,
      sortBy = 'createdAt',
      direction = 'desc',
      page = 0,
      size = 20
    } = params;

    const queryParams = new URLSearchParams({
      sortBy,
      direction,
      page: page.toString(),
      size: size.toString()
    });

    if (keyword) {
      queryParams.append('keyword', keyword);
    }

    const response = await axiosInstance.get(`/products?${queryParams}`);
    return response.data;
  },

  /**
   * 상품 상세 조회
   * @param {number} id - 상품 ID
   * @returns {Promise<Object>} 상품 상세 정보
   */
  getProduct: async (id) => {
    const response = await axiosInstance.get(`/products/${id}`);
    return response.data;
  },

  /**
   * 상품 등록 (인증 필요)
   * @param {Object} productData - 상품 정보
   * @param {string} productData.name - 상품명
   * @param {number} productData.price - 가격
   * @param {number} productData.stock - 재고
   * @param {FileList} productData.images - 상품 이미지 파일들
   * @returns {Promise<Object>} 생성된 상품 정보
   */
  createProduct: async (productData) => {
    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('price', productData.price);
    formData.append('stock', productData.stock);
    
    // 이미지 파일들을 FormData에 추가
    if (productData.images) {
      Array.from(productData.images).forEach(image => {
        formData.append('images', image);
      });
    }

    const response = await axiosInstance.post('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * 상품 수정 (인증 필요)
   * @param {number} id - 상품 ID
   * @param {Object} productData - 수정할 상품 정보
   * @returns {Promise<Object>} 수정된 상품 정보
   */
  updateProduct: async (id, productData) => {
    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('price', productData.price);
    formData.append('stock', productData.stock);
    
    // 새로운 이미지가 있는 경우에만 추가
    if (productData.images && productData.images.length > 0) {
      Array.from(productData.images).forEach(image => {
        formData.append('images', image);
      });
    }

    const response = await axiosInstance.put(`/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * 상품 삭제 (인증 필요)
   * @param {number} id - 상품 ID
   * @returns {Promise<string>} 삭제 결과 메시지
   */
  deleteProduct: async (id) => {
    const response = await axiosInstance.delete(`/products/${id}`);
    return response.data;
  },

  /**
   * 상품 대량 등록 (인증 필요)
   * @param {File} csvFile - 상품 정보 CSV 파일
   * @param {File} zipFile - 이미지 ZIP 파일 (선택)
   * @returns {Promise<Object>} 대량 등록 결과
   */
  bulkUpload: async (csvFile, zipFile = null) => {
    const formData = new FormData();
    formData.append('csvFile', csvFile);
    
    if (zipFile) {
      formData.append('zipFile', zipFile);
    }

    const response = await axiosInstance.post('/products/bulk', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
}; 