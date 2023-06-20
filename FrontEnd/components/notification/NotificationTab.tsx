import { useState, } from "react";
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';


import getConfig from 'next/config';



const { publicRuntimeConfig } = getConfig();

const pagination = publicRuntimeConfig.PAGINATION;

console.log(pagination)

function buildPage({ currPage = 1, numberOfItems = 0, numberPerPage = 0, currentPage = 0, numberOfPages = 0, elements = Array(), turnCounter = false, sortColumn = -1, sortDirection = 1 }) {

    const trimStart = (currPage - 1) * numberPerPage;

    const trimEnd = trimStart + numberPerPage;

    const sortedElements = elements.slice().sort((a, b) => {
        if (sortColumn >= 0 && sortColumn < a.length) {
            const sortValueA = a[sortColumn];
            const sortValueB = b[sortColumn];
            if (typeof sortValueA === 'string' && typeof sortValueB === 'string') {
                return sortDirection * sortValueA.localeCompare(sortValueB);
            }
            else {
                return sortDirection * (sortValueA - sortValueB);
            }
        } else {
            return 0;
        }
    });

    return sortedElements.slice(trimStart, trimEnd);
}


function rowRenderer({ index, style, elements, sharedData, commonClass }: { index: any, style: any, elements: any, sharedData: any, commonClass: any }) {
    const n = elements[index];

    if (!n) {
        return null;
    }

    const i = index;
    let icon = "";

    if (Array.isArray(n) && n.length >= 2) {
        switch (n[1]) {
            case "Sh":
                icon = "icon_warning";
                break;
            case "Sm":
                icon = "icon_alert";
                break;
            case "Sl":
                icon = "icon_checkout";
                break;
            default:
                icon = "";
                break;
        }
    }

    return (
        <div key={i} style={style} className={commonClass + "  overflow-y-hidden"}>
            <div className={`my-6 mr-auto ml-auto Lato ${icon}`}>{n[3]}</div>
            <div className=" my-6 mr-auto ml-auto Lato">{n[1]}</div>
            <div className=" my-6 mr-auto ml-auto Lato">{n[2]}</div>
            <div className=" my-6 mr-auto ml-auto Lato">{n[0]}</div>
            <div className=" my-4 mr-auto ml-auto Lato">
                <button className=" bg-slate-200 border-black border-[1px] rounded-3xl py-2 px-4" onClick={() => { sharedData(n[0], n[4], n[5], n[3]) }}>Inspect</button>
            </div>
        </div>
    );
}


export default function NotificationTab({ sharedData, dataTab = Array(), filter }: { sharedData: any, dataTab: any, filter?: any }) {

    const [passNumber, setPassNumber] = useState(0);

    const [theSeverity, setTheSeverity] = useState('');

    const [searchTerm, setSearchTerm] = useState('');

    const [sortColumn, setSortColumn] = useState();

    const [sortDirection, setSortDirection] = useState(1);


    const handleSort = (column: any) => {
        console.log("handleSort called, current sortColumn:", sortColumn, "clicked column:", column);
        if (sortColumn === column) {
            setSortDirection(sortDirection * -1);
        } else {
            if (column !== null && column >= 0 && column <= 3) {
                setSortColumn(column);
                setSortDirection(1);
            }
        }
    };

    const searchResults = dataTab.filter((n: any) => {
        return n[0].toLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
            n[3].toLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
            n[2].toString().toLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
            n[1].toString().toLowerCase().includes(searchTerm.toLocaleLowerCase())
    });


    const numberOfItems = searchResults.length;

    const numberPerPage = pagination;

    const numberOfPages = Math.ceil(numberOfItems / numberPerPage);

    let page = Array(numberOfPages);

    for (let i = 0; i < numberOfPages; i++) {
        page[i] = i;
    }

    const commonClass = "grid grid-cols-5 bg-slate-200 rounded-md text-[0.86vw] mb-[2px]"

    const sortedElements = buildPage({
        currPage: passNumber + 1,
        numberOfItems: searchResults.length,
        numberPerPage: pagination,
        elements: searchResults,
        sortColumn: sortColumn,
        sortDirection: sortDirection,
    });

    page.map((n, i) => {
        page[i] = <button className={"bg-white rounded-2xl w-6 h-6 bold " + (n == passNumber ? "invert" : "")} onClick={() => { setPassNumber(i); }}>{i + 1}</button>

    });

    const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setPassNumber(0);
    };

    const renderArrowIcon = (columnIndex: any) => {
        return sortColumn === columnIndex ? (
            sortDirection === 1 ? (
                <div className="my-[26px] w-[0.7rem] h-[0.4rem] bg-contain bg-[url('../resource/IMG/Arrow_down.png')] bg-no-repeat"></div>
            ) : (
                <div className="my-[26px] w-[0.7rem] h-[0.4rem] bg-contain bg-[url('../resource/IMG/Arrow.png')] bg-no-repeat"></div>
            )
        ) : (
            <div className="my-[26px] w-[0.7rem] h-[0.4rem] bg-contain bg-[url('../resource/IMG/Arrow.png')] bg-no-repeat"></div>
        );
    };

    return <>
        <div className="grid grid-cols-[40vw_1fr] mt-1 mb-[99px] h-[30px]">
            <div className="pl-1 pt-0 mt-0 text-[16px] Lato sm:text-[1.10vw] h-[30px]">Critical AI Notifications
                <select value={theSeverity} onChange={e => { setTheSeverity(e.target.value); }} className="w-[120px] sm:w-[14vw] sm:ml-6 bg-transparent rounded-3xl text-[#2FA4E7] pl-4 pr-6 border-[3px] border-[#2FA4E7] h-[30px]">
                    <option value="Sh">Severe</option>
                    <option value='Sm'>Medium Severity</option>
                    <option value='Sl'>Not Critical</option>
                </select>
            </div>
            <input
                id="icon_mag"
                className="ml-auto w-[150px] sm:w-[200px] xl:w-[300px] rounded-3xl pl-5 outline-none bg-[#F0F3F9] h-[30px]"
                type="search"
                name=""
                value={searchTerm}
                onChange={handleSearchTermChange}
                placeholder="search" />
        </div>
        <div className="grid grid-cols-5 gap-1 bg-slate-200 rounded-md text-[1.0vw] mb-[1px]">
            <div className="Lato-bold grid grid-cols-2 cursor-pointer ml-auto" onClick={() => { handleSort(0); console.log(sortColumn) }}>
                <div className="ml-auto mr-auto Lato-bold my-4">Anomaly id &nbsp;&nbsp;&nbsp;</div>
                {renderArrowIcon(0)}
            </div>
            <div className="grid gap-1 grid-cols-2 cursor-pointer" onClick={() => { handleSort(1); console.log(sortColumn) }}>
                <div className="ml-auto mr-auto Lato-bold my-4">Severity</div>
                {renderArrowIcon(1)}
            </div>
            <div className="grid gap-1 grid-cols-2 cursor-pointer" onClick={() => { handleSort(2), console.log(sortColumn) }}>
                <div className="ml-auto mr-auto Lato-bold my-4">Class</div>
                {renderArrowIcon(2)}
            </div>
            <div className="grid gap-1 grid-cols-2 cursor-pointer" onClick={() => { handleSort(3), console.log(sortColumn) }}>
                <div className="Lato-bold mr-auto ml-auto my-4">Cell id</div>
                {renderArrowIcon(3)}
            </div>
            <div className="Lato-bold mr-auto ml-auto my-4">Action</div>
        </div>
        <div style={{ width: '100%', height: '500px' }}>
            <AutoSizer>
                {({ width, height }) => {
                    const typedWidth = width as number;
                    const typedHeight = height as number;
                    return (
                        <List
                            height={typedHeight}
                            itemCount={sortedElements.length}
                            itemSize={102}
                            width={typedWidth}
                            style={{ scrollbarWidth: 'none' }}
                        >
                            {({ index, style }) =>
                                rowRenderer({ index, style, elements: sortedElements, sharedData, commonClass })}
                        </List>

                    );
                }}
            </AutoSizer>

        </div>

        <div className="grid grid-cols-2">
            <div></div>
            <div className="ml-auto">
                {page}
            </div>
        </div>

    </>
}