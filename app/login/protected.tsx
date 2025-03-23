// pages/protected.tsx
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';

const ProtectedPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <p>読み込み中...</p>;
  }

  return (
    <div>
      <h1>保護されたページ</h1>
      <p>ようこそ、{user.displayName}さん！</p>
    </div>
  );
};

export default ProtectedPage;
