import React from 'react';
import { useMobile } from '@/hooks/useMobile';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
  mobile?: boolean; // Whether to show on mobile
}

interface ResponsiveTableProps {
  data: any[];
  columns: Column[];
  onRowClick?: (row: any) => void;
  mobileCard?: (row: any) => React.ReactNode;
}

export function ResponsiveTable({ 
  data, 
  columns, 
  onRowClick,
  mobileCard 
}: ResponsiveTableProps) {
  const { isMobile } = useMobile();

  if (isMobile) {
    return (
      <div className="space-y-3">
        {data.map((row, index) => (
          <Card 
            key={index} 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onRowClick?.(row)}
          >
            <CardContent className="p-4">
              {mobileCard ? (
                mobileCard(row)
              ) : (
                <div className="space-y-3">
                  {columns
                    .filter(col => col.mobile !== false)
                    .map((column) => (
                      <div key={column.key} className="flex justify-between items-center">
                        <span className="text-sm font-medium text-muted-foreground">
                          {column.label}
                        </span>
                        <span className="text-sm">
                          {column.render 
                            ? column.render(row[column.key], row)
                            : row[column.key]
                          }
                        </span>
                      </div>
                    ))}
                  <div className="flex justify-end pt-2 border-t">
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            {columns.map((column) => (
              <th
                key={column.key}
                className="text-left p-3 font-medium text-muted-foreground"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={index}
              className="border-b hover:bg-muted/50 cursor-pointer"
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((column) => (
                <td key={column.key} className="p-3">
                  {column.render 
                    ? column.render(row[column.key], row)
                    : row[column.key]
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 