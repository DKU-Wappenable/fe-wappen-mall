import { useState } from 'react';
import { productService, userService } from '../../api/services';
import { toast } from 'react-toastify';

/**
 * API 연동 테스트 페이지
 * 개발 중에 API 호출을 직접 테스트할 수 있는 컴포넌트
 */
const ApiTestPage = () => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});

  // 테스트 결과를 표시하는 함수
  const showResult = (testName, data) => {
    setResults(prev => ({
      ...prev,
      [testName]: JSON.stringify(data, null, 2)
    }));
  };

  // 로딩 상태를 설정하는 함수
  const setTestLoading = (testName, isLoading) => {
    setLoading(prev => ({
      ...prev,
      [testName]: isLoading
    }));
  };

  // 1. 상품 목록 조회 테스트
  const testGetProducts = async () => {
    const testName = 'getProducts';
    try {
      setTestLoading(testName, true);
      
      const data = await productService.getProducts({
        page: 0,
        size: 10,
        sortBy: 'createdAt',
        direction: 'desc'
      });
      
      showResult(testName, data);
      toast.success('상품 목록 조회 성공!');
    } catch (error) {
      console.error('상품 목록 조회 실패:', error);
      showResult(testName, { error: error.message });
      toast.error('상품 목록 조회 실패');
    } finally {
      setTestLoading(testName, false);
    }
  };

  // 2. 상품 검색 테스트
  const testSearchProducts = async () => {
    const testName = 'searchProducts';
    try {
      setTestLoading(testName, true);
      
      const data = await productService.getProducts({
        keyword: '테스트',
        page: 0,
        size: 10
      });
      
      showResult(testName, data);
      toast.success('상품 검색 성공!');
    } catch (error) {
      console.error('상품 검색 실패:', error);
      showResult(testName, { error: error.message });
      toast.error('상품 검색 실패');
    } finally {
      setTestLoading(testName, false);
    }
  };

  // 3. 회원가입 테스트
  const testSignup = async () => {
    const testName = 'signup';
    try {
      setTestLoading(testName, true);
      
      const data = await userService.signup({
        email: `test_${Date.now()}@example.com`,
        password: 'password123',
        name: '테스트 사용자',
        recoveryEmail: 'recovery@example.com'
      });
      
      showResult(testName, data);
      toast.success('회원가입 성공!');
    } catch (error) {
      console.error('회원가입 실패:', error);
      showResult(testName, { error: error.message });
      toast.error('회원가입 실패');
    } finally {
      setTestLoading(testName, false);
    }
  };

  // 4. 로그인 테스트
  const testLogin = async () => {
    const testName = 'login';
    try {
      setTestLoading(testName, true);
      
      const data = await userService.login({
        email: 'test@example.com',
        password: 'password123'
      });
      
      showResult(testName, data);
      toast.success('로그인 성공!');
    } catch (error) {
      console.error('로그인 실패:', error);
      showResult(testName, { error: error.message });
      toast.error('로그인 실패');
    } finally {
      setTestLoading(testName, false);
    }
  };

  // 5. CORS 테스트
  const testCors = async () => {
    const testName = 'cors';
    try {
      setTestLoading(testName, true);
      
      const response = await fetch('http://localhost:8080/api/products', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      showResult(testName, {
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
        data: data
      });
      toast.success('CORS 테스트 성공!');
    } catch (error) {
      console.error('CORS 테스트 실패:', error);
      showResult(testName, { error: error.message });
      toast.error('CORS 테스트 실패');
    } finally {
      setTestLoading(testName, false);
    }
  };

  // 테스트 버튼 컴포넌트
  const TestButton = ({ onClick, children, testName, variant = 'primary' }) => {
    const isLoading = loading[testName];
    const baseClasses = "px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
    const variants = {
      primary: "bg-blue-500 hover:bg-blue-600 text-white",
      success: "bg-green-500 hover:bg-green-600 text-white",
      warning: "bg-yellow-500 hover:bg-yellow-600 text-white",
      danger: "bg-red-500 hover:bg-red-600 text-white"
    };

    return (
      <button
        onClick={onClick}
        disabled={isLoading}
        className={`${baseClasses} ${variants[variant]}`}
      >
        {isLoading ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            테스트 중...
          </div>
        ) : (
          children
        )}
      </button>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">🧪 API 연동 테스트</h1>
      
      <div className="space-y-6">
        {/* Product API 테스트 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">📦 Product API 테스트</h2>
          <div className="space-y-3">
            <div className="flex gap-3">
              <TestButton onClick={testGetProducts} testName="getProducts">
                상품 목록 조회
              </TestButton>
              <TestButton onClick={testSearchProducts} testName="searchProducts" variant="success">
                상품 검색
              </TestButton>
            </div>
            
            {results.getProducts && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">상품 목록 결과:</h4>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto max-h-60">
                  {results.getProducts}
                </pre>
              </div>
            )}
            
            {results.searchProducts && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">상품 검색 결과:</h4>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto max-h-60">
                  {results.searchProducts}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* User API 테스트 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">👤 User API 테스트</h2>
          <div className="space-y-3">
            <div className="flex gap-3">
              <TestButton onClick={testSignup} testName="signup" variant="warning">
                회원가입
              </TestButton>
              <TestButton onClick={testLogin} testName="login" variant="success">
                로그인
              </TestButton>
            </div>
            
            {results.signup && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">회원가입 결과:</h4>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto max-h-60">
                  {results.signup}
                </pre>
              </div>
            )}
            
            {results.login && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">로그인 결과:</h4>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto max-h-60">
                  {results.login}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* CORS 테스트 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">🌐 CORS 테스트</h2>
          <div className="space-y-3">
            <TestButton onClick={testCors} testName="cors" variant="danger">
              Direct CORS 테스트
            </TestButton>
            
            {results.cors && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">CORS 테스트 결과:</h4>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto max-h-60">
                  {results.cors}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* 연결 상태 정보 */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">🔗 연결 정보</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>백엔드 URL:</strong> http://localhost:8080
            </div>
            <div>
              <strong>프론트엔드 URL:</strong> http://localhost:5173
            </div>
            <div>
              <strong>Swagger UI:</strong> http://localhost:8080/swagger-ui/index.html
            </div>
            <div>
              <strong>API Docs:</strong> http://localhost:8080/v3/api-docs
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiTestPage; 