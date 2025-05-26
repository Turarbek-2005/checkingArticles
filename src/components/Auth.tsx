import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const UserMe = async () => {
    try {
      const response = await fetch("/api/user/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log("UserMe:", data);
    } catch (error) {
      console.log("UserMe Error:", error);
    }
  };

  const SignIn = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("SignIn:", data);

      if (response.ok) {
        navigate("/");
      } else {
        alert("Неверные данные");
      }
    } catch (error) {
      console.log("SignIn Error:", error);
    } finally {
      UserMe();
    }
  };

  const SignUp = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, username, password }),
      });

      const data = await response.json();
      console.log("SignUp:", data);

      if (response.ok) {
        navigate("/");
      } else {
        alert("Ошибка при регистрации");
      }
    } catch (error) {
      console.log("SignUp Error:", error);
    } finally {
      UserMe();
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-[500px] h-[370px]">
        <CardHeader>
          <CardTitle className="text-3xl">Авторизация</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-5">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 p-2 border rounded border-stone-500"
              placeholder="email"
            />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-12 p-2 border rounded border-stone-500"
              placeholder="username"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 p-2 border rounded border-stone-500"
              placeholder="password"
            />
          </div>
          <div className="flex gap-4 mt-6 mr-4">
            <Button
              onClick={SignIn}
              className="w-1/2 h-12 cursor-pointer text-lg"
            >
              Войти
            </Button>
            <Button
              onClick={SignUp}
              className="w-1/2 h-12 cursor-pointer text-lg"
            >
              Зарегистрироваться
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
