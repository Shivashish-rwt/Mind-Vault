import React, { useState } from "react";
import PasswordInput from "../../components/PasswordInput";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axios";

function Signup() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState(null);

	const navigate = useNavigate();

	const handleSignup = async (e) => {
		e.preventDefault();

		if (!name) {
			setError("Please enter the name.");
			return;
		}

		if (!validateEmail(email)) {
			setError("Please enter a valid email address.");
			return;
		}

		if (!password) {
			setError("Please enter the password.");
			return;
		}

		setError("");

		//Api call for signup
		try {
			const response = await axiosInstance.post("/user/create-account", {
				fullName: name,
                email,
				password,
			});

			if(response.data?.error){
                setError(response.data.error);
				return;
			}

			if(response.data?.accessToken){
                localStorage.setItem("token", response.data.accessToken);
				navigate("/dashboard");
			}
		} catch (error) {
			if(error.response?.data?.error){
				setError(error.response.data.error);
			}else{
				setError("An unexpected error occurred. Please try again.");
			}
		}
	};

	return (
		<>
			<div className="flex items-center justify-center mt-28">
				<div className="w-96 border rounded bg-white px-7 py-10">
					<form onSubmit={handleSignup}>
						<h4 className="text-2xl mb-7">SignUp</h4>

						<input
							type="text"
							placeholder="Name"
							className="input-box"
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>

						<input
							type="text"
							placeholder="Email"
							className="input-box"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>

						<PasswordInput
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>

						{error && <p className="text-red-500 text-xs pb-1">{error}</p>}

						<button type="submit" className="btn-primary">
							Create Account
						</button>

						<p className="text-sm text-center mt-4">
							Already have an account?{" "}
							<Link to="/login" className="font-medium text-primary underline">
								Login
							</Link>
						</p>
					</form>
				</div>
			</div>
		</>
	);
}

export default Signup;
