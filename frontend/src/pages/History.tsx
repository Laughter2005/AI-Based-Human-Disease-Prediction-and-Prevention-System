import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { History as HistoryIcon, Search } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import api from '../services/api';

interface HistoryItem {
  id: number;
  top_disease: string;
  top_confidence: number;
  symptoms: string;
  created_at: string;
  model_name: string;
}

export function History() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get<HistoryItem[]>('/predictions/history');
        setItems(data);
      } catch {
        // endpoint not yet built — silent
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="container-app py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-zinc-100">
          Your health history
        </h1>
        <p className="mt-2 text-slate-600 dark:text-zinc-400">
          All your past symptom checks, most recent first.
        </p>

        <div className="mt-8 space-y-3">
          {loading && (
            <Card>
              <p className="text-sm text-slate-500 dark:text-zinc-500">Loading...</p>
            </Card>
          )}

          {!loading && items.length === 0 && (
            <Card className="text-center py-12">
              <HistoryIcon className="mx-auto h-12 w-12 text-slate-300 dark:text-zinc-700" />
              <p className="mt-4 font-medium text-slate-900 dark:text-zinc-100">
                No history yet
              </p>
              <p className="mt-1 text-sm text-slate-600 dark:text-zinc-400">
                Your past checks will appear here.
              </p>
              <Link to="/predict" className="mt-5 inline-block">
                <Button variant="primary" leftIcon={<Search className="h-4 w-4" />}>
                  Start a new check
                </Button>
              </Link>
            </Card>
          )}

          {items.map((item) => (
            <Card key={item.id} className="animate-fade-in">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-lg font-bold capitalize text-slate-900 dark:text-zinc-100">
                    {item.top_disease}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 dark:text-zinc-500">
                    {new Date(item.created_at).toLocaleString()} · Model: {item.model_name}
                  </p>
                </div>
                <Badge variant="primary">
                  {(item.top_confidence * 100).toFixed(0)}%
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}