import LoginForm from '../../components/form/loginForm/LoginForm';
import WelcomeScreen from '../../components/defaultLayout/WelcomeScreen';

export default function Login({ sharedData }: { sharedData: any }) {
    return <>
        <div className="grid grid-cols-7 grid-rows-3-custom min-h-screen">
            <div className="col-start-1 col-end-5 row-start-1 h-[16vh]">
                {/* template */}
            </div>
            <div className="sm:col-start-5 col-start-6 sm:col-span-3 col-span-2 row-start-2
            ">
                <LoginForm sharedData={sharedData} />
            </div>
            <div className="col-start-1 sm:col-end-5 col-end-6 row-start-1 row-end-3 bg-gradient-to-br from-[rgba(155,199,243,1)] to-[rgba(159,153,243,1)] rounded-tr-3xl rounded-br-3xl custom-shadow
            ">
            </div>
            <div className="col-start-1 row-start-2 col-span-4 ml-[45px] sm:col-start-1 sm:col-span-4 sm:ml-[44px] sm:row-start-2 md:col-start-1 md:ml-[50px] md:col-span-4 md:row-start-2 lg:col-start-1 lg:col-span-4 lg:ml-[100px] lg:row-start-2 xl:col-start-1 xl:col-span-3 xl:row-start-2 xl:ml-[180px]">
                <WelcomeScreen />
            </div>

        </div>
    </>
}