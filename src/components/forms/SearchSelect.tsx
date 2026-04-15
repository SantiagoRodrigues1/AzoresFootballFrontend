import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Check, ChevronsUpDown, Loader2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export interface SearchSelectOption {
  id: string;
  title: string;
  subtitle?: string;
}

interface SearchSelectProps {
  value: SearchSelectOption | null;
  onChange: (option: SearchSelectOption | null) => void;
  onSearch: (query: string) => Promise<SearchSelectOption[]>;
  placeholder: string;
  searchPlaceholder: string;
  emptyText: string;
  disabled?: boolean;
  queryKey: string;
}

export function SearchSelect({
  value,
  onChange,
  onSearch,
  placeholder,
  searchPlaceholder,
  emptyText,
  disabled = false,
  queryKey
}: SearchSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const enabled = open && query.trim().length >= 2;
  const { data = [], isLoading } = useQuery({
    queryKey: ['search-select', queryKey, query],
    queryFn: () => onSearch(query),
    enabled
  });

  const selectedLabel = useMemo(() => {
    if (!value) {
      return placeholder;
    }

    return value.subtitle ? `${value.title} · ${value.subtitle}` : value.title;
  }, [placeholder, value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="h-12 w-full justify-between rounded-full px-4 text-left font-normal"
          disabled={disabled}
        >
          <span className={cn('truncate', !value && 'text-muted-foreground')}>{selectedLabel}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] min-w-[280px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput placeholder={searchPlaceholder} value={query} onValueChange={setQuery} />
          <CommandList>
            {query.trim().length < 2 ? (
              <div className="flex items-center gap-2 px-4 py-4 text-sm text-muted-foreground">
                <Search className="h-4 w-4" /> Escreve pelo menos 2 caracteres.
              </div>
            ) : null}
            {query.trim().length >= 2 ? <CommandEmpty>{emptyText}</CommandEmpty> : null}
            {isLoading ? (
              <div className="flex items-center gap-2 px-4 py-4 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> A procurar...
              </div>
            ) : null}
            {!isLoading && data.length ? (
              <CommandGroup>
                {data.map((option) => (
                  <CommandItem
                    key={option.id}
                    value={`${option.title} ${option.subtitle || ''}`}
                    onSelect={() => {
                      onChange(option);
                      setOpen(false);
                      setQuery('');
                    }}
                    className="flex items-center justify-between gap-3 rounded-2xl px-3 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium text-foreground">{option.title}</p>
                      {option.subtitle ? <p className="truncate text-xs text-muted-foreground">{option.subtitle}</p> : null}
                    </div>
                    <Check className={cn('h-4 w-4 text-primary', value?.id === option.id ? 'opacity-100' : 'opacity-0')} />
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : null}
          </CommandList>
        </Command>
        {value ? (
          <div className="border-t border-border/70 p-2">
            <Button
              type="button"
              variant="ghost"
              className="w-full rounded-2xl text-sm"
              onClick={() => {
                onChange(null);
                setQuery('');
                setOpen(false);
              }}
            >
              Limpar seleção
            </Button>
          </div>
        ) : null}
      </PopoverContent>
    </Popover>
  );
}