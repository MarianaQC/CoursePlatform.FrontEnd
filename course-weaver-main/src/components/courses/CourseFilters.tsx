import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CourseFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
}

export function CourseFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
}: CourseFiltersProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar cursos..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Todos los estados" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="Draft">Borrador</SelectItem>
            <SelectItem value="Published">Publicado</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button onClick={() => navigate('/courses/new')}>
        <Plus className="mr-2 h-4 w-4" />
        Nuevo Curso
      </Button>
    </div>
  );
}
