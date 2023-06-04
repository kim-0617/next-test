import React, { useState } from "react";
import { useRouter } from "next/router";

const DetailPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [path, setPath] = useState<string>("");

  const goBack = () => {
    router.back();
  };

  const goForward = () => {
    // 5가 들어간 페이지는 history에 쌓지 않음
    if (id?.includes("5")) {
      router.replace(`/routes/${Number(id) + 1}`);
    } else {
      router.push(`/routes/${Number(id) + 1}`);
    }
  };

  return (
    <>
      <div className="as__path">{router.asPath}</div>
      <div className="button__wrap">
        <div onClick={goBack} className="button mr">
          이전
        </div>
        <div onClick={goForward} className="button">
          다음
        </div>
      </div>
    </>
  );
};

export default DetailPage;
