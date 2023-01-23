import React, { useEffect, useState } from "react";
import "../Styles/matrix.css";
import Square from "./Square";
export default function Matrix() {
  const [showTable, setShowTable] = useState(false);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [solutions, setSolutions] = useState([]);
  const [matrices, setMatrices] = useState("");
  const [n, setN] = useState();
  const [dimensions, setDimensions] = useState([]);
  const [minCost, setMinCost] = useState([]);
  const [kLocations, setKLocations] = useState([]);
  useEffect(() => {
    let minCost = [];
    let kLocations = [];
    //push null values to min cost
    for (let i = 0; i < n; i++) {
      minCost.push([]);
    }

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) minCost[i].push(null);
    }
    //push null values to k locations
    for (let i = 0; i < n; i++) {
      kLocations.push([]);
    }

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) kLocations[i].push(null);
    }
    //pull null values to dimensions
    let dimensions = [];
    for (let i = 0; i <= n; i++) {
      dimensions.push(null);
    }
    setDimensions(dimensions);
    setMinCost(minCost);
    setKLocations(kLocations);
  }, [n]);
  function printMatrices(start, end) {
    if (end - start === 1) return `A${start + 1}*A${end + 1}`;
    if (end - start === 0) return `A${start + 1}`;
    const breakPoint = kLocations[start][end];
    const firstPart = printMatrices(start, breakPoint);
    const secondPart = printMatrices(breakPoint + 1, end);
    return `(${firstPart})*(${secondPart})`;
  }
  function bottomUpMinCost() {
    const minCostCopy = [...minCost];
    for (let index = 0; index < minCost.length; index++) {
      minCostCopy[index] = [...minCost[index]];
    }
    const kLocationsCopy = [...kLocations];
    for (let index = 0; index < kLocations.length; index++) {
      kLocationsCopy[index] = [...kLocations[index]];
    }

    let step = 0;
    while (step <= n) {
      minCost.forEach((row, rowIndex) => {
        if (rowIndex + step >= n) return;

        const result = minMultipication(rowIndex, rowIndex + step, minCostCopy);
        minCostCopy[rowIndex][rowIndex + step] = result.min;
        kLocationsCopy[rowIndex][rowIndex + step] = result.k;
      });
      step++;
    }
    setMinCost(minCostCopy);
    setKLocations(kLocationsCopy);
  }

  function minMultipication(start, end, minCost) {
    // formula for matrices from index 0
    // minCost(start,k)+minCost(k+1,end)+p(start)*p(k+1)*p(end+1)
    if (end - start === 0) return { min: 0 };
    const possibleWays = end - start;
    const breakPoints = [];
    for (let k = 0; k < possibleWays; k++) {
      breakPoints.push(k + start);
    }
    let min = Infinity;
    let minK;
    breakPoints.forEach((k) => {
      let cost;
      cost =
        minCost[start][k] +
        minCost[k + 1][end] +
        dimensions[start] * dimensions[k + 1] * dimensions[end + 1];
      if (cost < min) {
        min = cost;
        minK = k;
      }
    });
    return { min, k: minK };
  }
  function printSquareSolution(start, end) {
    if (end - start === 0) return [];
    const possibleWays = end - start;
    const breakPoints = [];
    for (let k = 0; k < possibleWays; k++) {
      breakPoints.push(k + start);
    }
    const solutions = [];
    breakPoints.forEach((k) => {
      const cost =
        minCost[start][k] +
        minCost[k + 1][end] +
        dimensions[start] * dimensions[k + 1] * dimensions[end + 1];
      solutions.push(
        `minCost(${start + 1},${k + 1}) + minCost(${k + 2},${
          end + 1
        })+p${start}*p${k + 1}*p${end + 1} = ${cost}`
      );
    });
    return solutions;
  }
  function disableTable() {
    let result = false;
    dimensions.forEach((d) => {
      if (!d) {
        result = true;
      }
    });
    return result;
  }
  // disableTable();
  return (
    <div id="matrix">
      number of matrices:
      <input
        type="number"
        onChange={({ currentTarget }) => {
          setDimensions([]);
          setKLocations([]);
          setMinCost([]);
          setMatrices("");
          setSelectedSquare({});
          setSolutions([]);
          setN(currentTarget.value);
        }}
      />
      <div className="matrix__body">
        {n && (
          <span>
            <p>dimensions:</p>
            {dimensions.map((dimension, index) => {
              return (
                <div key={index}>
                  <label>{index}</label>
                  <input
                    onChange={({ currentTarget }) => {
                      let copyD = [...dimensions];
                      copyD[index] = currentTarget.value;
                      setDimensions(copyD);
                      setSolutions([]);
                      setMatrices("");
                      setSelectedSquare({});
                    }}
                    type="number"
                  />
                </div>
              );
            })}
          </span>
        )}
        {dimensions.length !== 0 && (
          <>
            {showTable && (
              <button
                className="matrix__btn  matrix__btn--blue"
                onClick={() => {
                  bottomUpMinCost();
                }}
              >
                generate values
              </button>
            )}
            {kLocations[0][n - 1] !== null && (
              <div>
                <button onClick={() => setMatrices(printMatrices(0, n - 1))}>
                  show matrices
                </button>
              </div>
            )}
            {!showTable && (
              <button
                className="matrix__btn"
                disabled={disableTable()}
                onClick={() => {
                  setShowTable(true);
                }}
              >
                show table
              </button>
            )}
          </>
        )}
        <div>{matrices}</div>
        <div className="matrix__table">
          <div>
            {showTable &&
              minCost.map((row, rIndex) => {
                return (
                  <div className="matrix__row" key={rIndex}>
                    {row.map((column, cIndex) => {
                      let value = minCost[rIndex][cIndex];
                      let k = kLocations[rIndex][cIndex];
                      if (rIndex > cIndex) {
                        value = "-";
                        k = null;
                      }
                      return (
                        <span
                          className="square-wrapper"
                          onClick={() => {
                            if (rIndex <= cIndex) {
                              if (!minCost[rIndex][cIndex]) {
                                let minCostCopy = [...minCost];
                                let kLocationsCopy = [...kLocations];
                                const result = minMultipication(
                                  rIndex,
                                  cIndex,
                                  minCost
                                );
                                minCostCopy[rIndex][cIndex] = result.min;
                                kLocationsCopy[rIndex][cIndex] = result.k;
                                setMinCost(minCostCopy);
                                setKLocations(kLocationsCopy);
                              }
                              setSolutions(printSquareSolution(rIndex, cIndex));
                              setSelectedSquare({ rIndex, cIndex });
                            }
                          }}
                          key={rIndex + cIndex}
                        >
                          <small>{cIndex === 0 && rIndex + 1} </small>
                          <small className="square-wrapper__cIndex">
                            {rIndex === 0 && cIndex + 1}
                          </small>
                          <Square k={k} value={value} />
                        </span>
                      );
                    })}
                  </div>
                );
              })}
          </div>
        </div>
        {solutions.length !== 0 && (
          <div>
            minCost of ({selectedSquare.rIndex + 1},{selectedSquare.cIndex + 1}
            ):
            <p>MIN{"{"}</p>
            {solutions.map((solution, index) => (
              <div key={index}>
                {kLocations[selectedSquare.rIndex][selectedSquare.cIndex] ===
                selectedSquare.rIndex + index ? (
                  <b>
                    k={selectedSquare.rIndex + 1 + index} ={">"}
                    {solution}
                  </b>
                ) : (
                  <p>
                    k={selectedSquare.rIndex + 1 + index} ={">"}
                    {solution}
                  </p>
                )}
              </div>
            ))}
            <p>{"}"}</p>
          </div>
        )}
        <div className="push"></div>
      </div>
    </div>
  );
}
