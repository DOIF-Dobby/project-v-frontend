import axios from 'axios';
import { useEffect, useState } from 'react';
import issueAccessToken from '../common/issueAccessToken';

export default function useCodes(groupCode: string, pageData: any) {
  const [codes, setCodes] = useState<any>([]);

  useEffect(() => {
    const fetchCodes = async () => {
      if (pageData) {
        await issueAccessToken();

        axios
          .get('/api/codes', {
            params: {
              groupCode: groupCode,
            },
          })
          .then((response) => setCodes(() => [...response.data]));
      }
    };

    fetchCodes();
  }, [pageData, groupCode]);

  return [codes, setCodes];
}
