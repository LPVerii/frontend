import DemoMenuItem from "./DemoMenuItem";

export default function MainMenu({ className }: { className?: string }) {

    return (
        <>
            <ul className={className}>
                <DemoMenuItem url="/#" bgNameClass="bg-[url('../resource/IMG/Dashboard.png')]">Dashboard</DemoMenuItem>
                <DemoMenuItem url="/#" bgNameClass="">&nbsp;</DemoMenuItem>
                <DemoMenuItem url="/#" bgNameClass="">&nbsp;</DemoMenuItem>
                <DemoMenuItem url="/#" bgNameClass="">&nbsp;</DemoMenuItem>
                <DemoMenuItem url="/#" bgNameClass="">&nbsp;</DemoMenuItem>
                <DemoMenuItem url="/#" bgNameClass="">&nbsp;</DemoMenuItem>
            </ul>
            <div className="grid grid-cols-2 mt-[20vh] w-[8rem]">
            </div>
        </>
    )
}