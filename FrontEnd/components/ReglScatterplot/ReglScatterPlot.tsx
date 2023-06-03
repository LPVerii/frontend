import createScatterplot from "regl-scatterplot";
import { useEffect, useRef } from "react";
import { v4 as uuidv4 } from 'uuid';
import * as d3 from "d3";

function drawPoints(svgRef: any, canvasRef: any, { data }: { data: any[][] }) {
  let points = data.map((d) => [d[0], d[2]]);

  const margin = { top: 20, right: 20, bottom: 131, left: 100 };
  const width = 600 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const svg = d3
    .select(svgRef.current)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const xScale = d3.scaleLinear().domain([d3.min(points, (d: any) => d[0]), d3.max(points, (d: any) => d[0])]).range([0, width]);

  const yScale = d3.scaleLinear().domain([d3.min(points, (d: any) => d[1]), d3.max(points, (d: any) => d[1])]).range([height, 0]);

  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  svg.append("g").attr("transform", `translate(0, ${height})`).call(xAxis);

  svg.append("g").call(yAxis);


  const scatterplot = createScatterplot({
    canvas: canvasRef.current,
    width: canvasRef.current.clientWidth,
    height: canvasRef.current.clientHeight,
    pointSize: 5,
    pointColor: [1, 0.5, 0, 1],
    xScale,
    yScale,
  });

  let sourceOfPoints = points.map((d) => {
    (d[1] === 0) ? d[3] = [1, 1, 1, 1] : d[3] = [1, 0.5, 0, 1];
    return d;
  });

  scatterplot.set({
    pointColor: sourceOfPoints.map((d) => d[3]),
    // pointSize: [5,8,13],
  })

  sourceOfPoints = sourceOfPoints.map((d) => { return [d[0], d[1]] });

  scatterplot.draw(sourceOfPoints);

  return () => scatterplot.destroy();

}

export default function ReglScatterPlot({ className, data }: { className?: string, data: any[][] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const id = uuidv4();
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    drawPoints(svgRef, canvasRef, { data });
  });

  return <>
    <svg ref={svgRef} className="absolute transform-gpu h-[500px] w-[750px] top-11 left-[-77px]"></svg>
    <canvas
      ref={canvasRef}
      className={className}
      id={id}
      width={750}
      height={850}
    />
  </>
    ;
};