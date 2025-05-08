import React, { useState } from "react";
import { authStore } from "../store/authStore";
import { FaLock, FaMessage } from "react-icons/fa6";
import { MdMail } from "react-icons/md";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import { Link } from "react-router-dom";
import ImagePattern from "../components/ImagePattern";

const Login = () => {
    const {login, isLoggingIn} = authStore();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        login(formData);
    };
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* left side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
            {/* Logo */}
            <div className="text-center mb-8">
                <div className="flex flex-col items-center gap-2 group">
                    <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <FaMessage className="size-6 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold mt-2">Login to Account</h1>
                    <p className="text-base-content/60">Get started with your free account</p>
                </div>
            </div>
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="form-control">
                    <label className="label">
                        <span className="label-text font-medium">Email</span>
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MdMail />
                        </div>
                        <input type="email" className={`input input-bordered w-full pl-10`} placeholder="demo@email.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required /> 
                    </div>
                </div>
                <div className="form-control">
                    <label className="label">
                        <span className="label-text font-medium">Password</span>
                    </label>
                    <div className="relative">
                        <div className="absolute left-0 inset-y-0 pl-3 flex items-center pointer-events-none">
                            <FaLock />
                        </div>
                        <input type={showPassword ? "text" : "password"} className={`input input-bordered w-full pl-10`} placeholder="Password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} minLength="6" required />
                        <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? (<VscEyeClosed fontSize="1.3em" />) : (<VscEye fontSize="1.3em" />)}
                        </button>
                    </div>
                </div>
                <button type="submit" className="btn btn-primary w-full" disabled={isLoggingIn}>
                    {isLoggingIn ? (<>Loading...</>) : ("Log In")}
                </button>
            </form>
            <div className="text-center">
                <p className="text-base-content/60">
                    Does Not Have An Account?&nbsp;
                    <Link to="/signup" className="link link-primary">Sign Up</Link>
                </p>
            </div>
        </div>
      </div>
      {/* Right Side */}
      <ImagePattern title={"Join Our Commmunity"} subtitle={"Connect with friends, share moments and stay in touch with your loved ones."} />
    </div>
  )
}

export default Login