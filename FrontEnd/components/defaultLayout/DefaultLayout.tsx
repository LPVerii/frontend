import DemoMenu from "./DemoMenu";
import websocket from 'websocket'
import { useEffect, useRef, useState } from "react";
import NotificationTab from "../notification/NotificationTab";
import React from "react";
import * as authorization from 'firebase/auth'
import { auth } from '../../configureFirebase'
import router from "next/router";
import AeScatterplotComponent from "../AeScatterplot/AeScatterplot";
import Select from "react-select";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import getConfig from 'next/config';
import Modal from 'react-modal';


const { publicRuntimeConfig } = getConfig();

const backend_Url = publicRuntimeConfig.BACKEND_URL;

async function sleep(n: number) { return new Promise(resolve => setTimeout(resolve, n)); }

let errorMessage: any;

let wsclient: any;

let Open = 1;

let counter = 0;

wsclient = new websocket.w3cwebsocket(backend_Url);

wsclient.onopen = () => {
    console.log('WebSocket Client Connected');
};

wsclient.onerror = () => {
    console.log('Connection Error');
};


export default function DefaultLayout({ title, user }: { title: string, user: any }) {
    const [points, setPoints] = useState(Array());
    const [anomalies, setAnomalies] = useState(Array());
    const [open, setOpen] = useState(false);
    const [startTimestamp, setStartTimestamp] = useState(0);
    const [stopTimestamp, setStopTimestamp] = useState(0);
    const [table, setTable] = useState('');
    const [spinnerLoad, setSpinnerLoad] = useState(true);
    const [selectedOptions, setSelectedOptions] = useState(['']);
    const [selectDisabled, setSelectDisabled] = useState(true);
    const [defaultOptions, setDefaultOptions] = useState([null]);

    const [gridCol, setGridCol] = useState(true);

    const [anomaliesTitle, setAnomaliesTitle] = useState('');
    const [parametersAnomaliesNameValue, setParametersAnomaliesNameValue] = useState('empty');

    const [parametersAnomaliesName, setParametersAnomaliesName] = useState('empty');

    const [points2, setPoints2] = useState(Array());

    const [hours, setHours] = useState('empty');
    const [hours2, setHours2] = useState('empty');
    const [fileId, setFileId] = useState('empty');
    const [date2, setDate2] = useState('empty');
    const [date, setDate] = useState('empty');

    const [severity, setSeverity] = useState<number>();

    const [anomalyId, setAnomalyId] = useState('empty');

    const [failureType, setFailureType] = useState('empty');

    const [cellId, setCellId] = useState('empty');

    const [click, setClick] = useState(false);
    const [click2, setClick2] = useState(false);
    const [click3, setClick3] = useState(false);
    const [click4, setClick4] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [anomaliesTagType, setAnomaliesTagType] = useState('');
    const [columns, setColumns] = useState([{ value: 'Empty', label: 'Empty' },]);
    const [tag, setTag] = useState('');
    const [tag2, setTag2] = useState('');
    const [byDefault, setByDefault] = useState('');


    const sharedModalState = (state: any) => {
        setIsModalOpen(state);
    }

    const notify = toast;

    if (errorMessage !== undefined) { notify.error(errorMessage.message) }

    let scatterPlotSeverityChart: boolean;

    const sharedData = (table_name: any, start_timestamp: any, stop_timestamp: any, anomalies_name: any) => {

        setTable(table_name);

        setStartTimestamp(start_timestamp);

        setStopTimestamp(stop_timestamp);

        setAnomaliesTitle(anomalies_name);

        console.log('Table_name:', table_name, 'Start timestamp: ', start_timestamp, 'Stop timestamp: ', stop_timestamp);

        wsclient.send('{"request":"columns", "table":"' + table_name + '"}');

        setSelectDisabled(false);

    }

    const sharedPoints = (val: any) => {

        setTimeout(() => {
            wsclient.send('{"request":"columns", "table":"' + table + '"}');
        }, 1500);

        if (val === undefined) return;

        setParametersAnomaliesName(val);

        scatterPlotSeverityChart = true;

        wsclient.send('{"request":"data", "table":"' + table + '", "columns":[' + `"` + val + `"` + '], "start_timestamp" :' + '"' + startTimestamp + '"' + ', ' + '"end_timestamp":' + '"' + stopTimestamp + '"}');

    }

    function fillTheRow() {

        if (wsclient.readyState === Open && !!user && counter < 2)
            setTimeout(() => {
                wsclient.send('{"request":"anomalies"}');
                counter++;
            }, 1500);

    }


    useEffect(() => {


        fillTheRow()

        wsclient.onmessage = function (e: any) {
            try {
                if (typeof e.data === 'string') {

                    if (JSON.parse(e.data)?.reponse_to == 'columns') {
                        setColumns(JSON.parse(e.data)?.df?.data);
                        setDefaultOptions(JSON.parse(e.data)?.default);
                    }

                    if (JSON.parse(e.data)?.reponse_to == 'anomalies') {
                        setAnomalies(JSON.parse(e.data)?.df?.data);
                        setSpinnerLoad(false);
                    }

                    if (scatterPlotSeverityChart == true && JSON.parse(e.data)?.reponse_to == 'data') {
                        setPoints2(JSON.parse(e.data)?.df?.data);
                    }

                    if (scatterPlotSeverityChart == false && JSON.parse(e.data)?.reponse_to == 'data') {
                        setPoints(JSON.parse(e.data)?.df?.data);
                    }
                }

            } catch (e: any) {
                console.error(e);
                toast.error('Error: ' + e.message);
            }
        }

        function handleClickOutside(e: any) {
            if (e.target?.id !== 'le1') {
                setOpen(false);
            }
        }

        // document.addEventListener("mousedown", handleClickOutside);

        return () => {
            // document.removeEventListener("mousedown", handleClickOutside);
        }

    }, [points, columns, anomalies, points2])

    useEffect(() => {
        if (columns.length > 0 && defaultOptions[0] != null) {
            console.log('The Options: ', defaultOptions.toString(), table, startTimestamp, stopTimestamp, defaultOptions.map((item: any) => `"${item}"`).join(', ') as any, anomaliesTitle)
            setSelectedOptions(defaultOptions.map((item: any) => ({ value: item, label: item })) as any);
            console.log("selected options", selectedOptions);
            setByDefault(defaultOptions.map((item: any) => ({ value: item, label: item })) as any);
            scatterPlotSeverityChart = false;
            try {
                wsclient.send('{"request":"data", "table":"' + table + '", "columns":[' + defaultOptions.map((item: any) => `"${item}"`).join(', ') + '], "start_timestamp" :' + '"' + startTimestamp + '"' + ', ' + '"end_timestamp":' + '"' + stopTimestamp + '"}');
            }
            catch (e) {
                console.error(e);
            }
        };



    }, [columns, defaultOptions, table, startTimestamp, stopTimestamp, anomaliesTitle]);

    let mapColumns = columns.map((column: any) => {
        return { value: column[0], label: column[0] }
    }) as any;

    const openClose = () => {
        setOpen(!open);
    }

    const populateData = () => {
        try {
            wsclient.send('{"request":"anomalies"}');
        } catch (e: any) {
            console.log(e);
            setTimeout(() => { notify.error(e.message) }, 1500);
        }
    }

    const logout = () => {
        counter = 0;
        setOpen(!open);
        authorization.signOut(auth).then(() => {
            router.push('/');
        }
        ).catch((error: any) => {
            console.error(error)
        }
        );
    }


    const editTagVerifyAnomaly = (tag: any) => {

        wsclient.send('{"request":"save", "anomaly_id": "' + anomaliesTitle + '","verify_anomaly": "' + tag + '"}'); // This will be probably change

    }

    const editTagAnomalyType = (tag: any) => {

        wsclient.send('{"request":"save","anomaly_id": "' + anomaliesTitle + '", "anomaly_type": "' + tag + '"}'); // This will be probably change

    }

    const failureTypeValue = (value: any) => {

        // wsclient.send('{"request":"save","anomaly_id": "' + anomaliesTitle + '", "failure_type": "' + value + '"}'); // This will be probably change
    }

    const severityValue = (value: any) => {

        // wsclient.send('{"request":"save","anomaly_id": "' + anomaliesTitle + '", "severity": "' + value + '"}'); // This will be probably change
    }


    const combineEditTags = async (tag: any, tag2: any) => {
        editTagVerifyAnomaly(tag);
        await sleep(1500);
        editTagAnomalyType(tag2);
    }

    const handleSelectChange = (Options: any, actions: any) => {

        scatterPlotSeverityChart = false;
        setSelectedOptions(Options);
        const selectedOptionValues = Options.map((option: any) => `"${option.value}"`).join(', ') as any;
        if (!selectedOptionValues) { setPoints([]); return; }
        wsclient.send('{"request":"data", "table":"' + table + '", "columns":[' + selectedOptionValues + '], "start_timestamp" :' + '"' + startTimestamp + '"' + ', ' + '"end_timestamp":' + '"' + stopTimestamp + '"}');

    }

    const customStyles = {
        control: (provided: any, state: any) => ({
            ...provided,
            color: "white",
            backgroundColor: "#A0C2DA",
            borderColor: "#A0C2DA",
            borderRadius: 50,
            "&:hover": {
                borderColor: "#A0C2DA",
            },
        }),
        menu: (provided: any, state: any) => ({
            ...provided,
            borderRadius: 20, // or any other value to achieve the desired roundness
        }),
        option: (provided: any, state: any) => ({
            ...provided,
            backgroundColor: "transparent",
            borderRadius: 30,
            "&:hover": {
                color: "#409FF5",
            },
            // other style properties for the options
        }),
        singleValue: (provided: any, state: any) => ({
            ...provided,
            color: "white !important",
        }),
        dropdownIndicator: (provided: any, state: any) => ({
            ...provided,
            color: "white",
            "&:hover": {
                color: "white",
            },
        }),
        multiValue: (provided: any) => ({
            ...provided,
            backgroundColor: "#A0C2DA",
            borderColor: "white",
            borderRadius: 50,
        }),
        multiValueLabel: (provided: any) => ({
            ...provided,
            color: 'white',
        }),
        placeholder: (provided: any) => ({
            ...provided,
            color: "white",
        }),
    };

    const modalContentText = 'Are you want to save the tag?';

    return <>
        <ToastContainer />
        <Modal
            isOpen={isModalOpen}
            onRequestClose={() => { }}
            onAfterOpen={() => { }}
            className="Modal bg-white rounded-lg shadow-lg p-4"
            overlayClassName="Overlay bg-black bg-opacity-50 fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center"
        >
            <h1><b> Verify information.</b></h1>
            <div className="h-[2px]">&nbsp; </div>
            <p>{modalContent ?
                modalContent :
                <div>
                    <label>Verify scale anomaly (0 or 1) :&nbsp;&nbsp;&nbsp;&nbsp;</label>
                    <input type="number" min="0" max="1"
                        className="w-20 border-[1px] outline-none border-gray-400 border-t-0 border-l-0 border-r-0 text-center"
                        value={tag}
                        onClick={() => { if (!click3) { setTag(''); setClick3(true) } }}
                        onChange={(e) => { setTag(e.target.value) }}
                    />
                    <div></div>
                    <label>Verify type of anomaly (tag) :</label>
                    <input type="text"
                        className="w-20 border-[1px] outline-none border-gray-400 border-t-0 border-l-0 border-r-0 text-center ml-[18px]"
                        value={tag2}
                        onClick={() => { if (!click4) { setTag2(''); setClick4(true) } }}
                        onChange={(e) => { setTag2(e.target.value) }}
                    />
                </div>
            }
                <div>&nbsp;</div>
            </p>
            <div></div>
            <div className="grid grid-rows-1 grid-cols-1">
                <div className="ml-auto">
                    <button className="shadow-xl bg-blue-500 text-white px-4 py-2 rounded mr-2" onClick={() => { setIsModalOpen(false); modalContent.length === 0 ? combineEditTags(tag, tag2) : anomaliesTagType === 'failureTag' ? failureTypeValue(parametersAnomaliesNameValue) : severityValue(failureType) }}>Yes</button>
                    <button className="shadow bg-slate-200  text-slate-500 px-4 py-2 rounded" onClick={() => { setIsModalOpen(false); }}>No</button>
                </div>
            </div>
        </Modal>
        <div className="flex flex-col h-[100vh]">
            <div className="flex flex-grow">
                <div className="hidden md:flex items-start justify-between pl-8
                 bg-gradient-to-t  from-[#9F99F3] to-[#9BC7F3] text-blue-100 md:flex-shrink-0 md: w-[16rem]  md:justify-start h-[100vh] rounded-tr-3xl rounded-br-3xl">
                    <div className="relative">
                        <div className="w-[189px] h-[53px] mb-8 mt-[80px] bg-[url('../resource/IMG/logoType.png')] bg-contain bg-no-repeat"></div>
                        <DemoMenu className="text-sm" />
                    </div>
                </div>
                <div className="overflow-y-auto scrollbar-w-10 bg-white w-full" style={{ top: "100px" }}>
                    <div className="">
                        <div className="w-full grid grid-cols-2 grid-rows-2 md:grid-cols-[32.9vw_30vw] lg:grid-cols-[47.9vw_30vw] xl:grid-cols-[50.9vw_30vw] 2xl:grid-cols-[56vw_30vw] fixed z-50 text-2xl h-[70px] pt-[20px] shadow-custom font bg-white">
                            <div className="Lato text-[23px] leading-7 tracking-wide pl-12">{title}
                            </div>
                            <div id='PressToShowLogout' className="Lato text-[14px] ml-auto mr-14 cursor-pointer font-light sm:text-[16px] md:text-[18px] md:mr-0 lg:text-[20px] lg:mr-14 xl:text-[20px]  xl:mr-14 2xl:text-[22px] 2xl:mr-14 " onClick={() => openClose()}>
                                {user?.email}
                            </div>
                            <div>
                            </div>
                            {open ?
                                <div id="le1" className="ml-auto bg-slate-100 w-[74px] h-[35px] pl-1 mt-[10px] mr-[14px] 2xl:mr-[48px] border-slate-300 border-[1px] rounded-2xl shadow-lg cursor-pointer text-[16px]" onClick={() => logout()}>
                                    &nbsp; Logout
                                </div> :
                                null}
                        </div>
                        <section className="grid gap-1 grid-cols-1 xl:grid-cols-1 w-[calc(100%_-_50px)] transition-all  h-[100vh]">
                            <div className="grid gap-1 grid-cols-1 xl:grid-cols-1 mt-10">
                                <div className="mt-12 grid gap-1 grid-cols-2">
                                    <div className="mr-auto ml-16 font font pt-1 pr-10 text-[clamp(10px,0.89vw,16px)] ">{anomaliesTitle.charAt(0).toUpperCase() + anomaliesTitle.slice(1)}</div>
                                    <Select                                  
                                        isMulti
                                        isClearable={false}
                                        options={mapColumns}
                                        isDisabled={selectDisabled}
                                        styles={customStyles}
                                        onChange={handleSelectChange}
                                        className="w-auto ml-auto text-[clamp(9px,0.77vw,19px)]"
                                        value={selectedOptions}
                                    />
                                </div>
                            </div>
                            <div className={"grid gap-1 grid-rows-1 " + "sm:grid-cols-1" + " transition-all"}>

                                <div className="p-6 mt-2 bg-[#F0F3F9] h-[calc(100%_-_10px)] sm:min-w-[400px] w-[calc(100%_-_20px)] ml-10 rounded-2xl shadow-[3px_3px_6px_#999999]">
                                    <AeScatterplotComponent id={"first"} sharedPoints={sharedPoints} data={points} shareOptions={selectedOptions} clickable={true} shareModalState={sharedModalState} />
                                    <div className={"grid gap-1 grid-cols-1 mt-10 " + "hidden"} >
                                        <div className={"ml-auto mr-auto " + (gridCol ? null : "hidden")}>
                                            <div className="grid grid-row-2 grid-cols-4  text-[12px] lg:text-[14px]">

                                                <div className="grid w-24 lg:w-[112px] rounded-tl-md bg-white border-b-[1px] border-r-[1px] border-slate-400 py-2">
                                                    <p className="ml-auto mr-auto">Anomaly</p>
                                                </div>

                                                <div className=" w-24 lg:w-[112px] grid bg-white border-b-[1px] border-r-[1px] border-slate-400 py-2">
                                                    <p className="ml-auto mr-auto">Hours</p>
                                                </div>

                                                <div className="w-24 lg:w-[112px] bg-white grid border-b-[1px] border-r-[1px] border-slate-400 py-2">
                                                    <p className="ml-auto mr-auto">File ID</p>
                                                </div>

                                                <div className="w-24 lg:w-[112px] bg-white grid border-b-[1px] border-slate-400 rounded-tr-md py-2">
                                                    <p className="ml-auto mr-auto">Date</p>
                                                </div>

                                                <div className="grid w-24 lg:w-[112px] bg-white rounded-bl-md py-2">
                                                    <div className="ml-auto mr-auto">
                                                        {parametersAnomaliesNameValue}
                                                    </div>
                                                </div>

                                                <div className="w-24 lg:w-[112px] grid bg-white py-2">
                                                    <p className="ml-auto mr-auto">{hours}</p>
                                                </div>

                                                <div className="w-24 lg:w-[112px] bg-white grid py-2">
                                                    <p className="ml-auto mr-auto">{fileId}</p>
                                                </div>

                                                <div className="w-24 lg:w-[112px] bg-white grid rounded-br-md py-2">
                                                    <p className="ml-auto mr-auto">{date}</p>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className={"p-6 mt-2 " + (" hidden") + " bg-[#F0F3F9]  min-w-[400px] w-[calc(100%_-_20px)] h-[calc(100%_-_10px)] mt-10 ml-10 rounded-2xl shadow-[3px_3px_6px_#999999] transition-all  duration-[5000ms]"}>
                                    <AeScatterplotComponent id={"second"} sharedPoints={[]} data={points2} shareOptions={[]} clickable={false} />
                                    <div className="grid gap-1 grid-cols-1 mt-10">
                                        <div className={"ml-auto mr-auto " + (gridCol ? null : "hidden")}>
                                            <div className="grid grid-row-2 grid-cols-6 text-[12px]">

                                                <div className="grid w-[72px] lg:w-[74px] rounded-tl-md bg-white border-b-[1px] border-r-[1px] border-slate-400 py-2">
                                                    <p className="ml-auto mr-auto">Anomaly ID</p>
                                                </div>

                                                <div className=" w-[72px] lg:w-[74px] grid bg-white border-b-[1px] border-r-[1px] border-slate-400 py-2">
                                                    <p className="ml-auto mr-auto">Failure Type</p>
                                                </div>

                                                <div className="w-[72px] lg:w-[74px] bg-white grid border-b-[1px] border-r-[1px] border-slate-400 py-2">
                                                    <p className="ml-auto mr-auto">Cell ID</p>
                                                </div>

                                                <div className="w-[72px] lg:w-[74px] bg-white grid border-b-[1px] border-r-[1px] border-slate-400 py-2">
                                                    <p className="ml-auto mr-auto">Date</p>
                                                </div>

                                                <div className="w-[72px] lg:w-[74px] bg-white grid border-b-[1px] border-r-[1px] border-slate-400 py-2">
                                                    <p className="ml-auto mr-auto">Hours</p>
                                                </div>

                                                <div className="w-[72px] lg:w-[74px] bg-white grid border-b-[1px] border-slate-400 py-2">
                                                    <p className="ml-auto mr-auto">Severity</p>
                                                </div>

                                                <div className="grid w-[72px] lg:w-[74px] bg-white rounded-bl-md py-2">
                                                    <p className="ml-auto mr-auto">{anomalyId}</p>
                                                </div>

                                                <div className="w-[72px] lg:w-[74px] grid bg-white py-2">
                                                    <p className="ml-auto mr-auto">   <input
                                                        type="text"
                                                        className="w-20 outline-none border-0 text-center"
                                                        value={failureType}
                                                        onClick={() => { if (!click2) { setFailureType(''), setClick2(true) } }}
                                                        onChange={(e) => setFailureType(e.target.value)}
                                                        onKeyDown={(e) => { if (e.key === 'Enter') { setIsModalOpen(true); setModalContent(modalContentText); setAnomaliesTagType('typeTag') } }}
                                                    /></p>
                                                </div>

                                                <div className="w-[72px] lg:w-[74px] bg-white grid py-2">
                                                    <p className="ml-auto mr-auto">{cellId}</p>
                                                </div>

                                                <div className="w-[72px] lg:w-[74px] bg-white grid rounded-br-md py-2">
                                                    <p className="ml-auto mr-auto">{date2}</p>
                                                </div>

                                                <div className="w-[72px] lg:w-[74px] bg-white grid rounded-br-md py-2">
                                                    <p className="ml-auto mr-auto">{hours2}</p>
                                                </div>

                                                <div className="w-[72px] lg:w-[74px] bg-white grid rounded-br-md py-2">
                                                    <p className="ml-auto mr-auto">
                                                        <input type="number" min="0" max="1" step="0.1"
                                                            className="w-20 outline-none border-0 text-center appearance-none leading-tight"
                                                            value={severity}
                                                            onClick={() => { if (!click) { setParametersAnomaliesNameValue(''), setClick(true) } }}
                                                            onChange={(e) => setSeverity(e.target.valueAsNumber)}
                                                            onKeyDown={(e) => { if (e.key === 'Enter') { setIsModalOpen(true); setModalContent(modalContentText); setAnomaliesTagType('failureTag') } }}
                                                        />
                                                    </p>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div className="grid gap-1 grid-cols-3 w-[calc(100%_-_20px)]">
                                <div></div>
                            </div>
                            <div className="w-[98%] xl:w-[100%] m-10  pr-4">
                                {spinnerLoad === true ? null : <NotificationTab
                                    sharedData={sharedData}
                                    dataTab={anomalies}
                                />
                                }
                                {spinnerLoad === true ?
                                    <div className="relative grid grid-cols-1 grid-rows-1 mt-6">

                                        <div className="mr-auto ml-auto mb-6">
                                            <div className="w-60 h-60 border-[#dcd7f1] border-2 rounded-full"></div>
                                            <div className="w-60 h-60 border-[#3575DD] border-t-2 animate-spin rounded-full absolute left-50 top-0"></div>
                                        </div>

                                    </div> : null
                                }
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    </>
}