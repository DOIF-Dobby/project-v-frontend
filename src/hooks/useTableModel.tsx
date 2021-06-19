import { TableModelProps } from 'doif-react-kit';
import { useMemo } from 'react';

export default function useTableModel(
  data: TableModelProps[],
  pageData: any,
  deps: Array<any> = [],
): TableModelProps[] {
  const dependencies = [pageData].concat(deps);

  const model: TableModelProps[] = useMemo(
    () =>
      data.map((el) => ({
        ...el,
        label: pageData
          ? pageData.labelMap[el.label]
            ? pageData.labelMap[el.label].name
            : el.label
          : el.label,
      })),
    // eslint 설정을 다음 줄에서만 비활성화
    // eslint-disable-next-line
    dependencies,
  );

  return model;
}
