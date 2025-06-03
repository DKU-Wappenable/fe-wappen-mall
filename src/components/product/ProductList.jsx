import { useState, useEffect } from 'react';
import { productService } from '../../api/services/productService';
import { toast } from 'react-toastify';

/**
 * 상품 목록 컴포넌트
 * 백엔드 API와 연동하여 상품 목록을 표시하는 예제 컴포넌트
 */
const ProductList = () => {
  // 상태 관리
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState('createdAt');
  const [direction, setDirection] = useState('desc');

  // 상품 목록 조회 함수
  const fetchProducts = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const requestParams = {
        keyword: searchKeyword,
        sortBy,
        direction,
        page: currentPage,
        size: 20,
        ...params
      };

      const data = await productService.getProducts(requestParams);
      
      setProducts(data.content || []);
      setTotalPages(data.totalPages || 0);
      
      toast.success('상품 목록을 불러왔습니다.');
    } catch (err) {
      console.error('상품 목록 조회 실패:', err);
      setError('상품 목록을 불러오는데 실패했습니다.');
      toast.error('상품 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 상품 목록 조회
  useEffect(() => {
    fetchProducts();
  }, [currentPage, sortBy, direction]);

  // 검색 처리
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(0); // 검색 시 첫 페이지로 이동
    fetchProducts({ page: 0, keyword: searchKeyword });
  };

  // 정렬 변경 처리
  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      // 같은 정렬 기준이면 방향만 변경
      setDirection(direction === 'asc' ? 'desc' : 'asc');
    } else {
      // 다른 정렬 기준이면 기준 변경하고 desc로 설정
      setSortBy(newSortBy);
      setDirection('desc');
    }
    setCurrentPage(0);
  };

  // 페이지 변경 처리
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  // 로딩 상태 렌더링
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // 에러 상태 렌더링
  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 text-lg mb-4">{error}</div>
        <button 
          onClick={() => fetchProducts()}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 페이지 제목 */}
      <h1 className="text-3xl font-bold text-gray-800 mb-8">상품 목록</h1>

      {/* 검색 및 정렬 섹션 */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* 검색 폼 */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="상품명으로 검색..."
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            검색
          </button>
        </form>

        {/* 정렬 옵션 */}
        <div className="flex gap-2">
          <button
            onClick={() => handleSortChange('name')}
            className={`px-4 py-2 rounded ${
              sortBy === 'name' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            이름순 {sortBy === 'name' && (direction === 'asc' ? '↑' : '↓')}
          </button>
          <button
            onClick={() => handleSortChange('price')}
            className={`px-4 py-2 rounded ${
              sortBy === 'price' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            가격순 {sortBy === 'price' && (direction === 'asc' ? '↑' : '↓')}
          </button>
          <button
            onClick={() => handleSortChange('createdAt')}
            className={`px-4 py-2 rounded ${
              sortBy === 'createdAt' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            등록일순 {sortBy === 'createdAt' && (direction === 'asc' ? '↑' : '↓')}
          </button>
        </div>
      </div>

      {/* 상품 목록 */}
      {products.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          등록된 상품이 없습니다.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {/* 상품 이미지 */}
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                {product.imageUrls && product.imageUrls.length > 0 ? (
                  <img 
                    src={product.imageUrls[0]} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400">이미지 없음</span>
                )}
              </div>
              
              {/* 상품 정보 */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">
                  {product.name}
                </h3>
                <p className="text-2xl font-bold text-blue-600 mb-2">
                  {product.price?.toLocaleString()}원
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  재고: {product.stock}개
                </p>
                <p className="text-xs text-gray-500">
                  등록일: {new Date(product.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            이전
          </button>
          
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNumber = Math.max(0, Math.min(totalPages - 5, currentPage - 2)) + i;
            return (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                className={`px-4 py-2 rounded ${
                  currentPage === pageNumber
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {pageNumber + 1}
              </button>
            );
          })}
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
            className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductList; 