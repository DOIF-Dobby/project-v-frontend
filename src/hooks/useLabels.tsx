import { useMemo } from 'react';

/**
 * pageData에서 LABEL 데이터 추출
 * { labelCode: labelName } 형태로 반환
 */
export default function useLabels(pageData: any) {
  const labels = useMemo(() => {
    if (!pageData) {
      return {};
    }

    const labelMap: { [index: string]: string } = {};

    for (const property in pageData.labelMap) {
      labelMap[property] = pageData.labelMap[property].name;
    }

    return labelMap;
  }, [pageData]);

  return labels;
}
