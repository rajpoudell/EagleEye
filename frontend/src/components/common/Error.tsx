import React from 'react'
interface Errorprops{
error:string ;
}
const Error:React.FC<Errorprops> = ({error}) => {return <p className="text-center">{error}</p>}

export default Error