import React, { useState } from 'react';
import { useGame } from '@/context/game-context';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function CustomTopicScreen() {
  const { setStage } = useGame();
  const [category, setCategory] = useState('');
  const [topic, setTopic] = useState('');
  const [link, setLink] = useState('');

  const handleGenerateLink = () => {
    const generatedLink = `/custom/Category="${category}"selectedCharacter="${topic}"`;
    setLink(generatedLink);
  };

  const handleBack = () => {
    setStage('intro');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center p-6 h-full"
    >
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">カスタムお題追加</h1>
        <p className="text-xl">カテゴリーとお題を入力してください</p>
      </div>

      <div className="w-full max-w-md">
        <div className="mb-4">
          <Input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="カテゴリー"
            className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
          />
        </div>
        <div className="mb-4">
          <Input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="お題"
            className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
          />
        </div>
        <div className="mb-4">
          <Button
            onClick={handleGenerateLink}
            className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-10 py-6 rounded-full text-xl font-medium shadow-xl hover:shadow-2xl transition-all"
          >
            リンクを生成
          </Button>
        </div>
        {link && (
          <div className="mb-4">
            <p className="text-white">生成されたリンク:</p>
            <p className="text-yellow-300">{link}</p>
          </div>
        )}
        <div>
          <Button
            onClick={handleBack}
            className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-10 py-6 rounded-full text-xl font-medium shadow-xl hover:shadow-2xl transition-all"
          >
            戻る
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
