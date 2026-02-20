import React from "react";
import { Loader } from "../../common/Loader";
import InfoIcon from "./InfoIcon";

const PercentileVisualization = ({
  percentileRank,
  loading = false,
  title,
  description,
}) => {
  return (
    <div
      className="bg-white border border-[#E5E7EB] rounded-[8px] p-4 md:p-6 w-full min-h-[250px] md:min-h-[300px]"
      style={{ borderWidth: "1px" }}
    >
      <div className="flex items-center gap-2 mb-4 md:mb-6">
        <h2 className="text-[18px] md:text-[20px] font-bold text-oxford-blue font-archivo leading-[26px] md:leading-[28px] tracking-[0%]">
          {title}
        </h2>
        <InfoIcon />
      </div>

      <div className="flex flex-col items-center justify-center">
        <div className="relative w-full flex items-center justify-center min-h-[220px] md:min-h-[240px]">
          {loading ? (
            <div className="flex items-center justify-center">
              <Loader size="lg" />
            </div>
          ) : (
            <svg
              width="100%"
              height="220"
              viewBox="0 0 450 220"
              className="overflow-visible"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Bell curve filled area (normal distribution) */}
              {(() => {
                const points = [];
                const maxHeight = 150;
                const centerX = 200;
                const width = 450;
                const baseY = 220;

                // Create points for the filled area
                for (let x = 0; x <= width; x += 1) {
                  const normalizedX = (x - centerX) / (width / 4);
                  const y = maxHeight * Math.exp(-(normalizedX * normalizedX) / 2);
                  points.push(`${x},${baseY - y}`);
                }

                // Close the path to create filled area
                const pathData = `M 0,${baseY} L ${points.join(" L ")} L ${width},${baseY} Z`;

                return (
                  <>
                    {/* Filled area with light blue/gray */}
                    <path
                      d={pathData}
                      fill="#E8F4F8"
                      opacity="0.6"
                    />
                    {/* Bell curve outline */}
                    <path
                      d={`M ${points.join(" L ")}`}
                      fill="none"
                      stroke="#6CA6C1"
                      strokeWidth="2"
                    />
                  </>
                );
              })()}

              {/* Percentile indicator */}
              {percentileRank > 0 && (
                <>
                  {(() => {
                    const xPos = (percentileRank / 100) * 400;
                    const centerX = 200;
                    const normalizedX = (xPos - centerX) / (400 / 4);
                    const maxHeight = 150;
                    const baseY = 220;
                    const yPosOnCurve = baseY - maxHeight * Math.exp(-(normalizedX * normalizedX) / 2);
                    
                    // Red circle position - aligned on the curve
                    const circleY = yPosOnCurve;
                    const circleRadius = 5;
                    
                    // Position for orange label (above the circle with spacing)
                    const labelX = xPos + 20;
                    const labelWidth = 90;
                    const labelHeight = 40;
                    // Position label above circle with gap
                    const labelY = circleY - circleRadius - 20;
                    
                    // Vertical dashed line from circle through curve to bottom
                    const lineStartY = 0;
                    const lineEndY = baseY + 10;

                    return (
                      <>
                        {/* Red dashed vertical line passing through circle center */}
                        <line
                          x1={xPos}
                          y1={lineStartY}
                          x2={xPos}
                          y2={lineEndY}
                          stroke="#ED4122"
                          strokeWidth="2"
                          strokeDasharray="4 4"
                        />
                        
                        {/* Red circle on the curve (aligned with the line) */}
                        <circle cx={xPos} cy={circleY} r={circleRadius} fill="#ED4122" />
                        
                        {/* Dashed line connecting circle to label bottom */}
                        <line
                          x1={xPos}
                          y1={circleY - circleRadius}
                          x2={xPos}
                          y2={labelY + labelHeight / 2}
                          stroke="#ED4122"
                          strokeWidth="1.5"
                          strokeDasharray="3 3"
                        />
                        
                        {/* Orange rounded rectangle label */}
                        <g transform={`translate(${labelX - labelWidth / 2}, ${labelY - labelHeight / 2})`}>
                          <rect
                            x="0"
                            y="0"
                            width={labelWidth}
                            height={labelHeight}
                            rx="6"
                            fill="#ED4122"
                          />
                          {/* Top text: "percentile" */}
                          <text
                            x={labelWidth / 2}
                            y="14"
                            textAnchor="middle"
                            fill="white"
                            fontSize="10"
                            fontWeight="500"
                            fontFamily="Archivo, sans-serif"
                            dominantBaseline="middle"
                          >
                            percentile
                          </text>
                          {/* Bottom text: "82nd %ile" */}
                          <text
                            x={labelWidth / 2}
                            y="30"
                            textAnchor="middle"
                            fill="white"
                            fontSize="16"
                            fontWeight="700"
                            fontFamily="Archivo, sans-serif"
                            dominantBaseline="middle"
                          >
                            {percentileRank}th %ile
                          </text>
                        </g>
                      </>
                    );
                  })()}
                </>
              )}
            </svg>
          )}
        </div>

        {description && (
          <div className="flex items-center justify-center py-3 px-5 bg-[#F9FAFB] w-full max-w-[450px] mx-auto rounded-[10px] mt-3 md:mt-4">
            <p className="text-[11px] md:text-[14px] leading-[20px] font-normal text-[#6A7282] font-roboto">
              {description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PercentileVisualization;
