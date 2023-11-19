import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Login = (props) => {
    const [user, setUser]= useState({email: "", password: ""});
      const navigate= useNavigate();
  
      const handleSubmit = async (e)=>{
          e.preventDefault();
          const response = await fetch(`http://localhost:5000/api/auth/login`, {
              method: "POST", // *GET, POST, PUT, DELETE, etc.
              headers: {
                "Content-Type": "application/json"
              },body: JSON.stringify({email: user.email, password: user.password})
            });
            const json = await response.json();
            if (json.success){
              // fetch the authtoken and redirect
              localStorage.setItem('token', json.authtoken) 
              navigate("/");
              props.showAlert("Welcome to iNotebook" , "success")
            }else{
              props.showAlert("Enter valid credentials" , "danger")
            }
      }
  
      const onChange= (e)=>{
          setUser({...user, [e.target.name]: e.target.value})
      }
    return (
      <div>
        <form onSubmit={handleSubmit} >
            <div className="mb-3">
                <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                <input type="email" className="form-control" name='email' value={user.email} id="exampleInputEmail1" aria-describedby="emailHelp" onChange={onChange} />
            </div>
            <div className="mb-3">
                <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                <input type="password" className="form-control" name='password' value={user.password} id="exampleInputPassword1" onChange={onChange} />
            </div> 
            <button type="submit" className="btn btn-primary">Submit</button>
        </form>
      </div>
    )
  }

export default Login
