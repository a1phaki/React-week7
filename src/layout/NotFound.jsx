import { useEffect } from "react";
import {  useNavigate } from "react-router-dom"

export default function NotFound(){
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/');
        }, 3000);

        // 清除 setTimeout，避免組件卸載時仍執行
        return () => clearTimeout(timer);
    }, [navigate]);

    return(
        <div className="text-center mt-5">
            <h1>找不到內容</h1>
            <p>3秒後將跳轉頁面</p>
        </div>
    )
}