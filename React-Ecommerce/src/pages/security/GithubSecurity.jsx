

// GithubSuccess.jsx
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { miAxios } from "../../core/axios/axios";
import { StaticLoading } from "../../core/placeholders/StaticLoading";
import { useAuth } from "../../core/context/AuthContext";

export default function GithubSuccess() {
  const [searchParams] = useSearchParams();
  const { setAuth } = useAuth()
  const navigate = useNavigate();

  useEffect(() => {
    miAxios.get("/user/get-current-user", { withCredentials: true })
      .then(res => {
        console.log("Logged in:", res.data);
        navigate("/user/explore");
      })
      .catch(() => navigate("/signIn"));
  }, []);


  return <StaticLoading/>;
}
