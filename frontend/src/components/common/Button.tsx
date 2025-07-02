import React from "react";

interface buttonprops{
    clickout?:(e: React.FormEvent) => void;
    name:string;
    className?:string
}
const Button:React.FC<buttonprops> = ({clickout,name,className}) => {
  return (
    <button
    type="submit"
      onClick={clickout}
      className={`${className}  py-2 px-4 rounded  hover:bg-slate-700 transition btn  bg-slate-900   text-white cursor-pointer`}

    >
      {name}
    </button>
  );
};

export default Button;
