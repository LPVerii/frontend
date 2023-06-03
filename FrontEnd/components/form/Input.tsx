import { useRef, useState } from "react";

export default function Input({inputRef, type = 'text', icon_name ='', second_icon='',  sharedState, ...props}: {inputRef: any, type: string, icon_name: string, second_icon: string, sharedState: any}) {

    const [ toggleMode, setToggleMode ] = useState(false);
   

    return (
        <label className=" border-b-2 border-[#2FA4E7]">
            <input id={icon_name} type={type} className={`sm:w-[90%] lg:w-[92%] w-9 Roboto pl-[35px] sm:py-4 lg:py-2 outline-none sm:text-[10px] lg:text-xl`} ref={inputRef} {...props} />
            <div className={"w-[23px] h-[15px] inline-block" + " " +(second_icon)} onClick={() => {setToggleMode(!toggleMode); sharedState(toggleMode);} }></div>
        </label>
    )
}