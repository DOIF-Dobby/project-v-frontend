import React from 'react';
import { Link } from 'react-router-dom';

function UnAuthorization() {
  return (
    <div>
      401 권한 불충분 <Link to="/login">로그인 페이지로</Link>
    </div>
  );
}

export default UnAuthorization;
