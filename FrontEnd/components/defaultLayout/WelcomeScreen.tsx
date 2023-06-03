export default function WelcomeScreen() {
    return <>
        <div className="">
            <div className="sm:px-0 sm:pt-0 sm:pb-0">
                <div className=" w-[150px] h-[150px] bg-[url('../resource/IMG/LOGO.png')] ml-0 bg-contain mr-auto my-[2rem] bg-no-repeat"></div>
                <h1 className=" text-white text-[1.7rem] Lato-regular leading-5">Welcome to</h1>
                <h2 className="text-white  uppercase bold sm:text-[25px] lg:text-[30px] mb-6 Lato-bold">
                Machinery Analytics</h2>
                <div className="w-[11.8vw] h-[2px] bg-white "></div>
                <p className="text-white  mt-[2.6rem] text-[24px] Lato-extra">Login to access dashboard</p>
            </div>
        </div>
    </>
}