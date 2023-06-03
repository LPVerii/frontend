import Link from 'next/link';


function handlerChange(e: any) {
    let isCheeked = e.target.checked;
    localStorage.setItem('isChecked', isCheeked);
}

export default function Checkbox({ label = '', customLinkText = '', ...props }) {
    return (
        <div className="grid grid-cols-2">
            <div>
                <input type="checkbox" {...props} id="chkbx" onChange={(e: any) => handlerChange(e)} />
                <label htmlFor="chkbx" className="chkbxlab pr-1"></label>
                <span className="text-sm">{label}</span>
            </div>
            <div className="ml-auto text-sm pt-[5px]"><Link href="#" legacyBehavior>{customLinkText}</Link></div>
        </div>
    );
}