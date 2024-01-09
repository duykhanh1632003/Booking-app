import { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../UserContext";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false)
    const {setUser} = useContext(UserContext)

    async function handleLogin(e) {
        e.preventDefault();
        try {
            const response = await axios.post('/login', {
                email,
                password
            });
            setUser(response)
            console.log(response)
            if (response) {
                alert('login successful')
            }
            setRedirect(true)
        } catch (error) {
            console.error("Axios Error:", error);
        }
    }

    if (redirect) {
        return <Navigate to={'/'} />
    }

    return (
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-64">
                <h1 className="text-4xl text-center mb-4">Login</h1>
                <form className="max-w-lg mx-auto" onSubmit={handleLogin}>
                    <input type="email" placeholder={'t@gmail.com'} 
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <input type="password" placeholder="Mật khẩu" 
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <button className="primary">Login</button>
                    <div className="text-center py-2">Nếu bạn chưa có tài khoản? <Link className="underline text-br" to={'/register'}>Đăng ký tại đây</Link></div>
                </form>
            </div>
        </div>
    );
}
