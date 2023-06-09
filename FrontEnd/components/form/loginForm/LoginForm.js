import Input from '../Input';
import Checkbox from '../Checkbox';
import { useState, useRef } from "react";
import getConfig from 'next/config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';

const { publicRuntimeConfig } = getConfig();

const company = publicRuntimeConfig.COMPANY;

export default function LoginForm({sharedData, shareData2}) {
    const [showPassword, setShowPassword] = useState(false);
    const userRef = useRef('');
    const passwordRef = useRef('');
    const [ isModalOpen, setIsModalOpen ] = useState(false);
    const refPassword = useRef('');
    const refEmail = useRef('');

    const openModal = () => {
        setIsModalOpen(true);
      }
    
      const closeModal = () => {
        setIsModalOpen(false);
      }

    const sharedState = (isPress) => {
        setShowPassword(isPress);
    }

    const sharedStateLog = (isPress) => {
        openModal();
    }

    function preventDefaultReloadOnLogin(e) {
        e.preventDefault();
    } 
    return <form className="overflow-hidden bg-white" onSubmit={preventDefaultReloadOnLogin}>
         <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="Modal bg-white rounded-lg shadow-lg p-4"
        overlayClassName="Overlay bg-black bg-opacity-50 fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center"
      >
    <h1><b>Yup we can reset password, shall we?</b></h1>
            <div className="h-[2px]">&nbsp; </div>
            <p>
                <div>
                <div className='h-2'></div>
                    <label></label>
                    <input
                        className="w-[100%] border-[1px]"
                        value={userRef.current.value}
                        ref={refEmail}
                    />
                    <div className='h-2'></div>
                </div>

                <div></div>
            </p>
            <div></div>
            <div className="grid grid-rows-1 grid-cols-1">
                <div className="ml-auto">
                    <button className="shadow-xl bg-blue-500 text-white px-4 py-2 rounded mr-2" onClick={() => { setIsModalOpen(false); shareData2(refEmail.current.value, refPassword.current.value)} }>Yes</button>
                    <button className="shadow bg-slate-200  text-slate-500 px-4 py-2 rounded" onClick={() => { setIsModalOpen(false); }}>No</button>
                </div>
            </div>

      </Modal>
        <div className="px-10 pt-6 pb-6 md:px-0 md:pt-0 md:pb-0 text-center">
            <div className=" invisible w-[108px] h-[108px]  bg-orange-400 rounded-full ml-auto mr-auto border-[7px] border-white  outline-[2px]  outline-double outline-[#2FA4E7]"></div>
            <h2 className='mt-5 Lato-bold-extra text-[24px] text-[#2FA4E7]'>&nbsp; {company} </h2>
            <div className="flex flex-col space-y-10  text-left mt-[80px] sm:mx-[1px] md:mx-[20px] lg:mx-[40px] xl:mx-[80px] 2xl:mx-[100px]">
                <Input icon_name="icon_email" type="email" placeholder="Email" inputRef={userRef}/>
                <Input icon_name={"icon_password"} type={showPassword ? "text": 'password'} second_icon={showPassword ? "icon_name_second_open": "icon_name_second"}  sharedState={sharedState} placeholder="Password" inputRef={passwordRef}/>
                <Checkbox label="Remember me" customLinkText="Forgot password?" sharedStateLog={sharedStateLog} />
                <button className="btn bg-[#2FA4E7] h-[45px] text-white rounded-3xl sm:mx-[1px] md:mx-[3px] lg-mx:[5px] xl:mx-[15px] 2xl:mx-[25px] Lato-bold" onClick={() => {sharedData(userRef.current.value, passwordRef.current.value )} }>Sign in</button>
            </div>
        </div>
    </form>
}