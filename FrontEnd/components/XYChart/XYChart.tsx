import * as d3 from "d3";
import React from "react";
import { useEffect, RefObject } from "react";

function setNumber(arg: number) {
    return arg;
}

function InitAxis(svgRef: RefObject<SVGSVGElement>, { data, dataRange, noTransition }: { data: [], dataRange: [], noTransition: boolean }) {
    const width = setNumber(900);
    const height = setNumber(500);
    
    let svg = d3.select(svgRef.current)
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 " + width + " " + height)

    let margin = { top: setNumber(35), right: setNumber(25), bottom: setNumber(55), left: setNumber(55) }
    

    svg.selectAll("*").remove();

    let x = d3.scaleBand()
        .domain(dataRange.map((d: any) => d.player))
        .range([margin.left, width - margin.right])
        .padding(0.1)

    let y = d3.scaleLinear()
        .domain([0, d3.max(dataRange, (d: any) => d.goals)])

        .range([height - margin.bottom, margin.top])

    let xAxis = d3.axisBottom(x)

    let yAxis = d3.axisLeft(y)

    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(xAxis)

    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(yAxis)

    svg.append("text")
        .attr("x", width / setNumber(2))
        .attr("y", height - margin.bottom + setNumber(40))
        .attr("text-anchor", "middle")
        .text("Example of a bar chart")

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", margin.left - setNumber(50))
        .attr("x", -height / setNumber(2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Example of a bar chart")
    // mark chart data score
    noTransition ?
        svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("x", (d: any): any => x(d.player))
            .attr("y", (d: any) => { return y(0) })
            .attr("class", "bar")
            .attr("width", x.bandwidth())
            .attr("height", (d: any) => y(0) - y(d.score))
            .attr("y", (d: any) => y(d.score))
            .attr("fill", "#A0C2DA")
        :
        svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("x", (d: any): any => x(d.player))
            .attr("y", (d: any) => { return y(0) })
            .attr("class", "bar")
            .attr("width", x.bandwidth())
            .transition()
            .duration(500)
            .attr("height", (d: any) => y(0) - y(d.score))
            .attr("y", (d: any) => y(d.score))
            .attr("fill", "#A0C2DA")

    noTransition ?
        // write score top of the bar
        svg.selectAll(".text")
            .data(data)
            .enter().append("text")
            .attr("class", "text")
            .attr("x", (d: any): any => (x(d.player) || 0) + x.bandwidth() / setNumber(2))
            .attr("y", (d: any) => y(d.score) - setNumber(5))
            .attr("text-anchor", "middle")
            .text((d: any) => d.score)
        :
        svg.selectAll(".text")
            .data(data)
            .enter().append("text")
            .attr("class", "text")
            .attr("x", (d: any): any => (x(d.player) || 0) + x.bandwidth() / setNumber(2))
            .attr("y", (d: any) => y(d.score) - 5)
            .attr("text-anchor", "middle")
            .text((d: any) => d.score)
            // delay show text score
            .transition()
            .duration(1000)
            .attr("opacity", 1)

    // add export to file options
    svg.append("text")
        .attr("x", width - setNumber(425))
        .attr("y", height - setNumber(1375))
        .attr("text-anchor", "middle")
        .text("...")
        .style("font", "23px sans-serif")
        .style("font-weight", "bold")
        .style("cursor", "pointer")
        // rotate text 90 degrees
        .style("transform", "rotate(90deg)")
        .on("click", (e) => {
            //  creat div with display none postioin absolute z-index 1 margin-left calc(100% - 100px) margin-top -38px width 111px height 111px background #fff border 1px solid #000000 border-radius 5px
            let div = document.createElement("div");
            div.style.display = "block";
            div.style.position = "absolute";
            div.style.zIndex = "1";
            div.style.marginLeft = "calc(100% - 100px)";
            div.style.marginTop = "-38px";
            div.style.width = "111px";
            div.style.height = "111px";
            div.style.background = "#fff";
            div.style.border = "1px solid #000000";
            div.style.borderRadius = "5px";
            e.target.parentElement.parentElement.appendChild(div);
            // creat p elment wit class name 
            let p0 = document.createElement("p");
            p0.className = "h-[32px] ml-[12px] mt-[5px] pl-[30px] bg-[url(../resource/IMG/Save.png)] bg-[length:20px_20px] bg-[position:0px_2px] bg-no-repeat cursor-pointer";
            p0.innerText = "Save";
            div.appendChild(p0);
            let p1 = document.createElement("p");
            p1.className = "h-[32px] ml-[12px] mt-[5px] pl-[30px] bg-[url(../resource/IMG/Export.png)] bg-[length:20px_20px] bg-[position:0px_2px] bg-no-repeat cursor-pointer";
            p1.innerText = "Export";
            div.appendChild(p1);
            let p2 = document.createElement("p");
            p2.className = "h-[32px] ml-[12px] mt-[5px] pl-[30px] bg-[url(../resource/IMG/Share.png)] bg-[length:20px_20px] bg-[position:0px_2px] bg-no-repeat cursor-pointer";
            p2.innerText = "Share";
            div.appendChild(p2);
            p0.onclick = (e) => {
                let svgString: any = svg.node();
                svgString.outerHTML;
                let svgBlob = new Blob([svgString], { type: "image/svg+xml" });
                let svgUrl = URL.createObjectURL(svgBlob);
                let downloadLink = document.createElement("a");
                downloadLink.href = svgUrl;
                downloadLink.download = "chart.svg";
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
                div.remove();

            }
            p1.onclick = (e) => {
                div.remove();
            }
            p2.onclick = (e) => {
                div.remove();
            }
        })
}

export default function XYChart({ data, dataRange, noTransition }: { data: any, dataRange: any, noTransition: boolean }) {
    const svg = React.useRef<SVGSVGElement>(null);
    useEffect(() => {
        InitAxis(svg, { data, dataRange, noTransition });
    });

    return (
        <div className="main bg-slate-200 h-[calc(100%_-_30px)] w-[calc(100%_-_20px)] mt-10 ml-10 rounded-2xl shadow-[3px_3px_6px_#999999]">
            <svg ref={svg}></svg>
        </div>
    )
}

