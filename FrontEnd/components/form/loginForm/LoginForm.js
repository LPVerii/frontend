import Input from '../Input';
import Checkbox from '../Checkbox';
import { useState, useRef } from "react";
import getConfig from 'next/config';


const { publicRuntimeConfig } = getConfig();

const company = publicRuntimeConfig.COMPANY;

export default function LoginForm({sharedData}) {
    const [showPassword, setShowPassword] = useState(false);
    const userRef = useRef(null);
    const passwordRef = useRef(null);

    const sharedState = (isPress) => {
        setShowPassword(isPress);
    }

    function preventDefaultReloadOnLogin(e) {
        e.preventDefault();
    } 
    return <form className="overflow-hidden bg-white" onSubmit={preventDefaultReloadOnLogin}>
        
        <div className="px-10 pt-6 pb-6 md:px-0 md:pt-0 md:pb-0 text-center">
            <div className=" invisible w-[108px] h-[108px]  bg-orange-400 rounded-full ml-auto mr-auto border-[7px] border-white  outline-[2px]  outline-double outline-[#2FA4E7]"></div>
            <h2 className='mt-5 Lato-bold-extra text-[24px] text-[#2FA4E7]'>&nbsp; {company} </h2>
            <div className="flex flex-col space-y-10  text-left mt-[80px] sm:mx-[1px] md:mx-[20px] lg:mx-[40px] xl:mx-[80px] 2xl:mx-[100px]">
                <Input icon_name="icon_email" type="email" placeholder="Email" inputRef={userRef}/>
                <Input icon_name={"icon_password"} type={showPassword ? "text": 'password'} second_icon={showPassword ? "icon_name_second_open": "icon_name_second"}  sharedState={sharedState} placeholder="Password" inputRef={passwordRef}/>
                <Checkbox label="Remember me" customLinkText="Forgot password?"/>
                <button className="btn bg-[#2FA4E7] h-[45px] text-white rounded-3xl sm:mx-[1px] md:mx-[3px] lg-mx:[5px] xl:mx-[15px] 2xl:mx-[25px] Lato-bold" onClick={() => {sharedData(userRef.current.value, passwordRef.current.value )} }>Sign in</button>
            </div>
        </div>
    </form>
}