import React, { useRef, useEffect, useState } from "react";
import {
  LineChart,
  lineElementClasses,
  markElementClasses,
  areaElementClasses,
} from "@mui/x-charts/LineChart";
import { Loader } from "../../common/Loader";
import InfoIcon from "./InfoIcon";
import FilterButtons from "./FilterButtons";

const AccuracyTrendChart = ({
  data = [],
  loading = false,
  selectedRange = "all",
  onRangeChange,
  title,
  tooltip,
}) => {
  const chartContainerRef = useRef(null);
  const [chartDimensions, setChartDimensions] = useState({ width: 0, height: 500 });

  useEffect(() => {
    const updateDimensions = () => {
      if (chartContainerRef.current) {
        const { width, height } = chartContainerRef.current.getBoundingClientRect();
        setChartDimensions({ width, height: height || 500 });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const filterOptions = [
    { value: "all", label: "All" },
    { value: "30", label: "30d" },
    { value: "7", label: "7d" },
  ];

  const sharedYAxis = [
    {
      min: 0,
      max: 100,
      label: "",
      tickNumber: 5,
    },
  ];

  const sharedSx = {
    width: "100%",

    // ── Tick labels (both axes) ──────────────────────────────────────────────
    "& .MuiChartsAxis-tickLabel": {
      fontSize: "12px",
      fill: "#6B7280",
      fontFamily: "Archivo, sans-serif",
    },
    "& .MuiChartsAxis-left .MuiChartsAxis-tickLabel": {
      textAnchor: "end",
    },

    // ── Left axis line (vertical rule on the left) ───────────────────────────
    "& .MuiChartsAxis-left .MuiChartsAxis-line": {
      stroke: "#E5E7EB",
      strokeWidth: 1,
    },
    // ── Bottom axis line (horizontal rule on the bottom) ────────────────────
    "& .MuiChartsAxis-bottom .MuiChartsAxis-line": {
      stroke: "#E5E7EB",
      strokeWidth: 1,
    },

    // Hide the small axis tick marks (the short perpendicular dashes)
    "& .MuiChartsAxis-tick": {
      display: "none",
    },

    // ── Dashed horizontal grid lines ─────────────────────────────────────────
    "& .MuiChartsGrid-horizontalLine": {
      stroke: "#E5E7EB",
      strokeWidth: 1,
      strokeDasharray: "4 4",
    },
    "& .MuiChartsGrid-verticalLine": {
      display: "none",
    },
  };

  // Build x-axis config — when only 1 data point exists we pad with a phantom
  // point so MUI doesn't center it.  We pass at least 2 index values so that
  // scaleType:"point" can anchor index 0 to the left edge.
  const buildXAxis = (d) => {
    const indices = d.map((_, i) => i);
    return [
      {
        data: indices,
        scaleType: "point",
        valueFormatter: (value) => d[value]?.date ?? "",
        // Always start from 0 so first point sits at the left edge
        min: 0,
        max: Math.max(indices.length - 1, 1),
        // Force all labels to show
        tickNumber: d.length,
        // Ensure all ticks are shown
        tickMinStep: 1,
      },
    ];
  };

  const dataSx = {
    ...sharedSx,

    // ── Solid line ──────────────────────────────────────────────────────────
    [`& .${lineElementClasses.root}`]: {
      stroke: "#6CA6C1",
      strokeWidth: 2,
      fill: "none",
    },

    // ── Markers: filled blue circle with white ring ──────────────────────────
    [`& .${markElementClasses.root}`]: {
      stroke: "#FFFFFF",
      strokeWidth: 2,
      fill: "#6CA6C1",
    },

    // ── Area: gradient fill ──────────────────────────────────────────────────
    [`& .${areaElementClasses.root}`]: {
      fill: "url(#areaGradient)",
    },
  };

  return (
    <div
      className="bg-white border border-[#E5E7EB] rounded-[8px] p-4 md:p-6 mb-6 md:mb-8 w-full"
      style={{ borderWidth: "1px" }}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-6 gap-3 md:gap-4">
        <div className="flex items-center gap-2 relative">
          <h2 className="text-[18px] md:text-[20px] font-bold text-oxford-blue font-archivo leading-[26px] md:leading-[28px] tracking-[0%]">
            {title}
          </h2>
          {tooltip && <InfoIcon tooltip={tooltip} />}
        </div>
        <FilterButtons
          options={filterOptions}
          selectedValue={selectedRange}
          onChange={onRangeChange}
        />
      </div>

      <div 
        ref={chartContainerRef}
        className="w-full relative" 
        style={{ height: "400px", minHeight: "400px" }}
      >
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader size="lg" />
          </div>
        ) : data.length > 0 ? (
          <LineChart
            width={chartDimensions.width || undefined}
            height={chartDimensions.height}
            series={[
              {
                data: data.map((d) => d.accuracy),
                color: "#6CA6C1",
                curve: "natural",
                showMarkers: true,
                area: true,
                // Solid line style
                lineStyle: {
                  strokeWidth: 2,
                  stroke: "#6CA6C1",
                },
              },
            ]}
            xAxis={[
              {
                data: data.map((_, i) => i),
                scaleType: "point",
                valueFormatter: (value) => data[value]?.date ?? "",
                min: 0,
                max: Math.max(data.length - 1, 1),
                // Force all labels to show - don't hide any
                tickNumber: data.length,
                // Show every tick
                tickMinStep: 1,
              },
            ]}
            yAxis={sharedYAxis}
            grid={{ horizontal: true, vertical: false }}
            slotProps={{
              tooltip: {
                content: ({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;
                  const dataIndex = payload[0].dataIndex;
                  const pointData = data[dataIndex];
                  const questionCount =
                    pointData?.totalQuestions ||
                    (pointData?.sessionCount != null
                      ? pointData.sessionCount * 10
                      : 20);

                  return (
                    <div
                      style={{
                        background: "#ffffff",
                        border: "1px solid #E5E7EB",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                        padding: "10px 14px",
                        minWidth: "110px",
                        pointerEvents: "none",
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          marginBottom: "3px",
                          fontSize: "13px",
                          fontWeight: 700,
                          color: "#111827",
                          fontFamily: "Archivo, sans-serif",
                          lineHeight: 1.4,
                        }}
                      >
                        {pointData?.date || ""}
                      </p>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "13px",
                          fontWeight: 500,
                          color: "#6CA6C1",
                          fontFamily: "Archivo, sans-serif",
                          lineHeight: 1.4,
                        }}
                      >
                        {questionCount}Q&nbsp;&nbsp;·&nbsp;&nbsp;{payload[0].value}%
                      </p>
                    </div>
                  );
                },
              },
            }}
            margin={{ left: -10, right: 20, top: 32, bottom: 0 }}
            sx={{
              ...dataSx,
              // Force all x-axis labels to be visible
              "& .MuiChartsAxis-bottom .MuiChartsAxis-tickLabel": {
                fontSize: "11px",
                fill: "#6B7280",
                fontFamily: "Archivo, sans-serif",
                opacity: 1,
              },
              // Minimize left axis label spacing
              "& .MuiChartsAxis-left .MuiChartsAxis-tickLabel": {
                fontSize: "11px",
                fill: "#6B7280",
                fontFamily: "Archivo, sans-serif",
                textAnchor: "end",
              },
            }}
          >
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6CA6C1" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#6CA6C1" stopOpacity={0.03} />
              </linearGradient>
            </defs>
          </LineChart>
        ) : (
          <LineChart
            width={chartDimensions.width || undefined}
            height={chartDimensions.height}
            series={[]}
            xAxis={[{ data: [], scaleType: "point", min: 0, max: 1 }]}
            yAxis={sharedYAxis}
            grid={{ horizontal: true, vertical: false }}
            margin={{ left: -10, right: 20, top: 32, bottom: 0 }}
            sx={sharedSx}
          />
        )}
      </div>
    </div>
  );
};

export default AccuracyTrendChart;