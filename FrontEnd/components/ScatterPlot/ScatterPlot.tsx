
import * as d3 from "d3";
import React from "react";
import { RefObject, useEffect } from "react";



function setNumber(arg: number) {
    return arg;
}

let buffer = 0;
let buffer2 = 0;

function InitScatterPlot(canvasRef: RefObject<HTMLCanvasElement>, svgRef: RefObject<SVGSVGElement>, { data, columns }: { data: Array<any>, columns: [] }) {
    const fullwidth = setNumber(799);
    const fullheight = setNumber(499);
    // margin
    let margin = { top: setNumber(35), right: setNumber(25), bottom: setNumber(75), left: setNumber(55) }

    const width = fullwidth - margin.left - margin.right;
    const height = fullheight - margin.top - margin.bottom;


    let canvas = d3.select(canvasRef.current)
        .attr("width", width - 1)
        .attr("height", height - 1)
        .style('transform', 'translate(' + (margin.left + 1) +
            'px,' + ',' + (margin.top + 1) + 'px)');

    let svg = d3.select(svgRef.current)
        .attr("width", fullwidth)
        .attr("height", fullheight)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," +
            margin.top + ")");

            svg.select('g>*').remove();   
    // ranges, scales, axis, objects
    let xRange = d3.extent(data, function (d: any) { return d[0]; });
    let yRange = d3.extent(data, function (d: any) { return d[1]; });

    
 
    let xScale = d3.scaleLinear()
        .domain([xRange[0] - 5, xRange[1] + 5])
        .range([0, width]);

    let yScale = d3.scaleLinear()
        .domain([yRange[0] - 5, yRange[1] + 5])
        .range([height, 0]);
     
    let xAxis = d3.axisBottom(xScale)
      
    let yAxis = d3.axisLeft(yScale)
        
    let zoomAll = d3.zoom()
        .scaleExtent([1, 40])
        .on("zoom", ({ transform }) => zoomed(transform));

    let xAxisSvg = svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    let yAxisSvg = svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    let context = canvas.node()?.getContext("2d");

    
    draw();

    canvas.call(zoomAll as any);

    function zoomed(transform: any) {
        let new_xScale = transform.rescaleX(xScale);
        let new_yScale = transform.rescaleY(yScale);
        xAxisSvg.call(xAxis.scale(new_xScale));
        yAxisSvg.call(yAxis.scale(new_yScale));
        context?.setTransform(transform.k, 0, 0, transform.k, transform.x, transform.y);
        draw();

    }

    function draw() {
        
        context?.clearRect(0, 0, width, height);
        context?.beginPath();
        context?.rect(0, 0, width, height);
        context?.clip();

        context?.beginPath();
        if (data.length > 0) {
            data.forEach(function (d: any) {
                let x = xScale(d[0]);
                let y = yScale(d[1]);
                let r = 4;
                context?.moveTo(x + r, y);
                context?.arc(x, y, r, 0, 2 * Math.PI);
            });
        }
        context?.fill();
        context?.stroke();
        
    }








}

export default function ScatterPlot({ data, columns }: { data: any, columns: any }) {
    const canvas = React.useRef<HTMLCanvasElement>(null);
    const svg = React.useRef<SVGSVGElement>(null);

    InitScatterPlot(canvas, svg, { data, columns });

    return <div className="main bg-slate-200 h-[calc(100%_-_30px)] w-[calc(100%_-_20px)] mt-10 ml-10 rounded-2xl shadow-[3px_3px_6px_#999999]">
        <svg ref={svg} style={{ position: 'absolute' }} ></svg>
        <canvas ref={canvas} style={{ position: 'absolute', left: '55px' }}></canvas>
    </div>
}

