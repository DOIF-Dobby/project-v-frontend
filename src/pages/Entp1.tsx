import axios from 'axios';
import { Box, Button, Container, Page } from 'doif-react-kit';
import React, { useCallback } from 'react';

function Entp1() {
  const onClick = useCallback(() => {
    axios
      .get('/api/projects', {
        headers: {
          pageId: 1,
        },
      })
      .then((res) => console.log(res));
  }, []);

  return (
    <Container gap="0.75rem">
      <Box>
        <div style={{ textAlign: 'center', height: '830px' }}>ENTP 1</div>
      </Box>
      <Box>
        <div style={{ textAlign: 'center', height: '830px' }}>
          <Button onClick={onClick}>프로젝트 조회</Button>
        </div>
      </Box>
    </Container>
  );
}

export default Entp1;
