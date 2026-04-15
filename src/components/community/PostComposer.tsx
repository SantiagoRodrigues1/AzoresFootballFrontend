import { useState, type ChangeEvent } from 'react';
import { ImagePlus, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

interface PostComposerProps {
  onSubmit: (payload: { text: string; image?: string | null }) => Promise<void>;
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Não foi possível ler o ficheiro selecionado.'));
    reader.readAsDataURL(file);
  });
}

export function PostComposer({ onSubmit }: PostComposerProps) {
  const [text, setText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const previewImage = imageFile || imageUrl.trim();

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(file.type)) {
      setError('A imagem tem de estar em PNG, JPG ou WebP.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('A imagem da publicação deve ter no máximo 5MB.');
      return;
    }

    try {
      setImageFile(await readFileAsDataUrl(file));
      setError(null);
    } catch (fileError) {
      setError(fileError instanceof Error ? fileError.message : 'Não foi possível carregar a imagem.');
    }
  };

  const handleSubmit = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setError(null);

    try {
      await onSubmit({ text: text.trim(), image: imageFile || imageUrl.trim() || null });
      setText('');
      setImageUrl('');
      setImageFile('');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Não foi possível publicar a mensagem.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-[28px] border border-border/70 bg-card p-4 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.35)]">
      <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary/70">
        <ImagePlus className="h-4 w-4" /> comunidade
      </div>
      <Textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Partilha uma opinião, análise ou destaque do jogo..."
        className="min-h-28 rounded-3xl border-none bg-muted/60 px-4 py-3 text-base shadow-none focus-visible:ring-1"
      />
      <div className="mt-3 grid gap-3 sm:grid-cols-[1fr,auto,auto]">
        <Input
          value={imageUrl}
          onChange={(event) => setImageUrl(event.target.value)}
          placeholder="URL opcional de imagem"
          className="rounded-full"
        />
        <Input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleFileChange}
          className="rounded-full"
        />
        <Button onClick={handleSubmit} disabled={loading || !text.trim()} className="rounded-full px-5">
          <Send className="mr-2 h-4 w-4" /> publicar
        </Button>
      </div>

      {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}
      {previewImage ? (
        <div className="mt-4 overflow-hidden rounded-[24px] border border-border/70 bg-muted/20">
          <img src={previewImage} alt="Pré-visualização da publicação" className="max-h-72 w-full object-cover" />
        </div>
      ) : null}
    </section>
  );
}
