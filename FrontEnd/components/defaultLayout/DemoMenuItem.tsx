import Link from "next/link";

export default function DemoMenuItem({ url, children,className,bgNameClass, ...props }: { url: string, children: any,className?:string,bgNameClass?:string }) {
    return (
        <li className={className}>

            <Link
                href={url}
                className={"p-3 text-blue-400 hover:text-blue-100 focus:text-blue-100 pl-[35px] inline-block w-[180px] bg-[length:25px_25px] bg-no-repeat bg-[position:0px_8px]" + " " + (bgNameClass) }>

                {children}

            </Link>
        </li>
    );
};