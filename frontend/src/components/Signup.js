import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Signup = (props) => {
  const [user, setUser]= useState({name: "", email: "", password: "", cpassword: ""});
      const navigate= useNavigate();
  
      const handleSubmit = async (e)=>{
          e.preventDefault();
          const {name,email,password,cpassword}= user;
          if(password === cpassword){
            const response = await fetch(`http://localhost:5000/api/auth/createuser`, {
                method: "POST", // *GET, POST, PUT, DELETE, etc.
                headers: {
                  "Content-Type": "application/json"
                },body: JSON.stringify({name , email, password})
              });
              const json = await response.json();
              if (json.success){
                // fetch the authtoken and redirect
                localStorage.setItem('token', json.authtoken) 
                navigate("/");
                props.showAlert("Account is succesfully created" , "success")
              }else{
                props.showAlert("enter correct credentials" , "danger")
              }
          }
          else{
            props.showAlert("password and confirmed password must be same", "danger")
          }
      }
  
      const onChange= (e)=>{
          setUser({...user, [e.target.name]: e.target.value})
      }

  return (
    <div>
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label htmlFor="name" className="form-label">Username</label>
                <input type="text" className="form-control" name='name' id="name" onChange={onChange} required/>
            </div>
            <div className="mb-3">
                <label htmlFor="email" className="form-label">Email address</label>
                <input type="email" className="form-control" name='email'  id="email" onChange={onChange} required/>
            </div>
            <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input type="password" className="form-control" name='password'  id="password" onChange={onChange} minLength={8} required/>
            </div> 
            <div className="mb-3">
                <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                <input type="password" className="form-control" name='cpassword' id="cpassword" onChange={onChange} minLength={8} required/>
            </div>
            <button  type="submit" className="btn btn-primary">Submit</button>
        </form>
    </div>
  )
}

export default Signup
