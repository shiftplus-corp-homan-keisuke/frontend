'use client';

import React, { useState, useEffect } from 'react';
import { AxisSelectorProps, ParsedCSVData, ColumnValidation } from '@/types';
import { validateColumns, getColumnWarnings, isValidYAxisColumn } from '@/lib/dataValidation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { AlertTriangle, X } from '@/components/ui/icons';

interface AxisSelectorExtendedProps extends AxisSelectorProps {
  csvData: ParsedCSVData;
  onPreviewUpdate?: () => void;
}

export const AxisSelector: React.FC<AxisSelectorExtendedProps> = ({
  headers,
  selectedXAxis,
  selectedYAxes,
  onXAxisChange,
  onYAxesChange,
  maxYAxes = 10,
  csvData,
  onPreviewUpdate
}) => {
  const [columnValidations, setColumnValidations] = useState<ColumnValidation[]>([]);
  const [warnings, setWarnings] = useState<{ [key: string]: string[] }>({});

  // Validate columns when CSV data changes
  useEffect(() => {
    if (csvData) {
      const validations = validateColumns(csvData);
      setColumnValidations(validations);
      
      // Generate warnings for current selections
      const newWarnings: { [key: string]: string[] } = {};
      
      if (selectedXAxis) {
        const xValidation = validations.find(v => v.columnName === selectedXAxis);
        if (xValidation) {
          newWarnings[selectedXAxis] = getColumnWarnings(xValidation, false);
        }
      }

      selectedYAxes.forEach(yAxis => {
        const yValidation = validations.find(v => v.columnName === yAxis);
        if (yValidation) {
          newWarnings[yAxis] = getColumnWarnings(yValidation, true);
        }
      });

      setWarnings(newWarnings);
    }
  }, [csvData, selectedXAxis, selectedYAxes]);

  // Handle X-axis selection
  const handleXAxisChange = (value: string) => {
    onXAxisChange(value);
    
    // Update warnings for the selected column
    const validation = columnValidations.find(v => v.columnName === value);
    if (validation) {
      setWarnings(prev => ({
        ...prev,
        [value]: getColumnWarnings(validation, false)
      }));
    }

    // Trigger preview update
    if (onPreviewUpdate) {
      onPreviewUpdate();
    }
  };

  // Handle Y-axis selection (multiple)
  const handleYAxisAdd = (value: string) => {
    if (!selectedYAxes.includes(value) && selectedYAxes.length < maxYAxes) {
      const newYAxes = [...selectedYAxes, value];
      onYAxesChange(newYAxes);

      // Update warnings for the selected column
      const validation = columnValidations.find(v => v.columnName === value);
      if (validation) {
        setWarnings(prev => ({
          ...prev,
          [value]: getColumnWarnings(validation, true)
        }));
      }

      // Trigger preview update
      if (onPreviewUpdate) {
        onPreviewUpdate();
      }
    }
  };

  // Handle Y-axis removal
  const handleYAxisRemove = (value: string) => {
    const newYAxes = selectedYAxes.filter(axis => axis !== value);
    onYAxesChange(newYAxes);

    // Remove warnings for the removed column
    setWarnings(prev => {
      const newWarnings = { ...prev };
      delete newWarnings[value];
      return newWarnings;
    });

    // Trigger preview update
    if (onPreviewUpdate) {
      onPreviewUpdate();
    }
  };

  // Get available Y-axis options (exclude already selected ones)
  const availableYAxes = headers.filter(header => !selectedYAxes.includes(header));

  // Get column validation for display
  const getColumnValidation = (columnName: string): ColumnValidation | undefined => {
    return columnValidations.find(v => v.columnName === columnName);
  };

  // Render column info
  const renderColumnInfo = (columnName: string) => {
    const validation = getColumnValidation(columnName);
    if (!validation) return null;

    return (
      <div className="text-xs text-gray-500 mt-1">
        <span className="font-medium">型:</span> {validation.dataType === 'number' ? '数値' : validation.dataType === 'string' ? '文字列' : '混合'}
        {validation.sampleValues.length > 0 && (
          <>
            <span className="ml-2 font-medium">例:</span> {validation.sampleValues.slice(0, 2).join(', ')}
            {validation.sampleValues.length > 2 && '...'}
          </>
        )}
      </div>
    );
  };

  // Render warnings
  const renderWarnings = (columnName: string) => {
    const columnWarnings = warnings[columnName];
    if (!columnWarnings || columnWarnings.length === 0) return null;

    return (
      <div className="mt-2 space-y-1">
        {columnWarnings.map((warning, index) => (
          <div key={index} className="flex items-start gap-2 text-sm text-amber-600 bg-amber-50 p-2 rounded">
            <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>{warning}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6" role="region" aria-label="グラフの軸選択">
      {/* X-axis Selection */}
      <div className="space-y-2">
        <Label htmlFor="x-axis-select" className="text-sm font-medium">
          X軸 (横軸)
        </Label>
        <Select value={selectedXAxis || ''} onValueChange={handleXAxisChange}>
          <SelectTrigger 
            id="x-axis-select"
            aria-describedby="x-axis-description"
          >
            <SelectValue placeholder="X軸に使用する列を選択してください" />
          </SelectTrigger>
          <SelectContent>
            {headers.map((header) => {
              const validation = getColumnValidation(header);
              return (
                <SelectItem key={header} value={header}>
                  <div className="flex items-center justify-between w-full">
                    <span>{header}</span>
                    {validation && (
                      <span className="ml-2 text-xs text-gray-500">
                        ({validation.dataType === 'number' ? '数値' : validation.dataType === 'string' ? '文字列' : '混合'})
                      </span>
                    )}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        
        <div id="x-axis-description" className="sr-only">
          X軸は横軸を表し、カテゴリや時間などのデータを表示します
        </div>
        
        {selectedXAxis && (
          <div role="status" aria-live="polite">
            {renderColumnInfo(selectedXAxis)}
            {renderWarnings(selectedXAxis)}
          </div>
        )}
      </div>

      {/* Y-axis Selection */}
      <div className="space-y-2" role="group" aria-labelledby="y-axis-label">
        <div className="flex items-center justify-between">
          <Label id="y-axis-label" className="text-sm font-medium">
            Y軸 (縦軸) - 最大{maxYAxes}個まで選択可能
          </Label>
          <span className="text-xs text-gray-500" aria-live="polite">
            {selectedYAxes.length}/{maxYAxes}個選択中
          </span>
        </div>

        {/* Add Y-axis dropdown */}
        {availableYAxes.length > 0 && selectedYAxes.length < maxYAxes && (
          <Select value="" onValueChange={handleYAxisAdd}>
            <SelectTrigger aria-describedby="y-axis-description">
              <SelectValue placeholder="Y軸に追加する列を選択してください" />
            </SelectTrigger>
            <SelectContent>
              {availableYAxes.map((header) => {
                const validation = getColumnValidation(header);
                const isRecommended = validation && isValidYAxisColumn(validation);
                
                return (
                  <SelectItem key={header} value={header}>
                    <div className="flex items-center justify-between w-full">
                      <span className={isRecommended ? 'text-green-700' : ''}>
                        {header}
                      </span>
                      {validation && (
                        <span className={`ml-2 text-xs ${isRecommended ? 'text-green-600' : 'text-gray-500'}`}>
                          ({validation.dataType === 'number' ? '数値' : validation.dataType === 'string' ? '文字列' : '混合'})
                          {isRecommended && ' ✓'}
                        </span>
                      )}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        )}

        <div id="y-axis-description" className="sr-only">
          Y軸は縦軸を表し、数値データを表示します。複数選択可能です。
        </div>

        {/* Selected Y-axes */}
        {selectedYAxes.length > 0 && (
          <div className="space-y-3" role="list" aria-label="選択されたY軸の一覧">
            <div className="text-sm font-medium text-gray-700">選択されたY軸:</div>
            {selectedYAxes.map((yAxis, index) => (
              <div key={yAxis} className="border rounded-lg p-3 bg-gray-50" role="listitem">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{yAxis}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleYAxisRemove(yAxis)}
                        className="h-6 w-6 p-0 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                        aria-label={`Y軸から ${yAxis} を削除`}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    {renderColumnInfo(yAxis)}
                  </div>
                </div>
                <div role="status" aria-live="polite">
                  {renderWarnings(yAxis)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Y-axes selected message */}
        {selectedYAxes.length === 0 && (
          <div className="text-sm text-gray-500 p-4 border-2 border-dashed border-gray-200 rounded-lg text-center">
            Y軸に使用する列を選択してください。数値データを含む列を選択することをお勧めします。
          </div>
        )}

        {/* Max limit reached message */}
        {selectedYAxes.length >= maxYAxes && (
          <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
            最大数に達しました。新しい列を追加するには、既存の選択を削除してください。
          </div>
        )}
      </div>

      {/* Selection Summary */}
      {(selectedXAxis || selectedYAxes.length > 0) && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-2">選択サマリー</h4>
          <div className="space-y-1 text-sm text-blue-800">
            {selectedXAxis && (
              <div>
                <span className="font-medium">X軸:</span> {selectedXAxis}
              </div>
            )}
            {selectedYAxes.length > 0 && (
              <div>
                <span className="font-medium">Y軸:</span> {selectedYAxes.join(', ')}
              </div>
            )}
            {selectedXAxis && selectedYAxes.length > 0 && (
              <div className="text-xs text-blue-600 mt-2">
                グラフを生成する準備ができました
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};