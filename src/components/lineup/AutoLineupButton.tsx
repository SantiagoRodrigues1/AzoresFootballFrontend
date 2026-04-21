import React, { useState } from 'react';
import { Wand2, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AutoLineupButtonProps {
  onGenerate: () => Promise<void>;
  isLoading?: boolean;
  disabled?: boolean;
}

export const AutoLineupButton: React.FC<AutoLineupButtonProps> = ({
  onGenerate,
  isLoading = false,
  disabled = false,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateLineup = async () => {
    setIsGenerating(true);
    try {
      await onGenerate();
    } catch {
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={handleGenerateLineup}
      disabled={disabled || isGenerating || isLoading}
      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 shadow-lg"
    >
      {isGenerating || isLoading ? (
        <>
          <Loader className="w-4 h-4 animate-spin" />
          A gerar escalação...
        </>
      ) : (
        <>
          <Wand2 className="w-4 h-4" />
          ✨ Gerar Escalação Sugerida
        </>
      )}
    </Button>
  );
};
