import React, { useState } from "react";

const  useForm = (initialState) => {
  const [data, setData] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value })
  }
   const resetForm = ()=>{
    setData(initialState)
   }

   return {
    data,
    handleChange,
    resetForm
   }
}
export default useForm