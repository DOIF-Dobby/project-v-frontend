import axios from 'axios';
import { useEffect, useState } from 'react';

export default function useCodes(groupCode: string, pageData: any) {
  const [codes, setCodes] = useState<any>([]);

  useEffect(() => {
    pageData &&
      axios
        .get('/api/codes', {
          params: {
            groupCode: groupCode,
          },
        })
        .then((response) => setCodes(() => [...response.data]));
  }, [pageData, groupCode]);

  return [codes, setCodes];
}
