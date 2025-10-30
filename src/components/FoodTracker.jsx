// src/components/FoodTracker.jsx

import React from "react";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import Alert from "react-bootstrap/Alert";
import Table from "react-bootstrap/Table";
import { FiPlus, FiTrash2, FiRefreshCw } from "react-icons/fi";

// --- Component: Add Food (Step 1) ---
const AddFood = ({
  foodData,
  selectedFoodId,
  setSelectedFoodId,
  selectedOption,
  setSelectedOption,
  currentOptions,
  handleAddFood,
  stepNumber,
}) => {
  return (
    <>
           {" "}
      <Card.Header as="h2" className="h5 fw-semibold p-3 text-white bg-success">
                {stepNumber}. Add Food to Meal      {" "}
      </Card.Header>
           {" "}
      <Card.Body className="p-4">
               {" "}
        <Row>
                   {" "}
          <Form.Group
            as={Col}
            md={6}
            controlId="food-select"
            className="mb-3 mb-md-0"
          >
                        <Form.Label className="fw-medium">Food Item</Form.Label>
                       {" "}
            <Form.Select
              value={selectedFoodId}
              onChange={(e) => {
                setSelectedFoodId(e.target.value);
                setSelectedOption("");
              }}
            >
                           {" "}
              <option value="" disabled>
                -- Select a food --
              </option>
                           {" "}
              {foodData.map((food) => (
                <option key={food.id} value={food.id}>
                  {food.name}
                </option>
              ))}
                         {" "}
            </Form.Select>
                     {" "}
          </Form.Group>
                   {" "}
          <Form.Group as={Col} md={6} controlId="option-select">
                       {" "}
            <Form.Label className="fw-medium">Serving Size</Form.Label>         
             {" "}
            <Form.Select
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
              disabled={!selectedFoodId}
            >
                           {" "}
              <option value="" disabled>
                -- Select a serving --
              </option>
                           {" "}
              {currentOptions.map((opt) => (
                <option key={opt.label} value={opt.multiplier}>
                  {opt.label}
                </option>
              ))}
                         {" "}
            </Form.Select>
                     {" "}
          </Form.Group>
                 {" "}
        </Row>
               {" "}
        <div className="d-grid mt-3 pt-2">
                   {" "}
          <Button
            variant="success"
            onClick={handleAddFood}
            disabled={!selectedFoodId || !selectedOption}
            className="d-flex align-items-center justify-content-center gap-2 fw-semibold"
          >
                        <FiPlus /> Add to Meal          {" "}
          </Button>
                 {" "}
        </div>
             {" "}
      </Card.Body>
         {" "}
    </>
  );
};

// --- Component: View Totals (Step 4) ---
export const Totals = ({
  dailyNeeds,
  totals,
  proteinByWeight,
  handleReset,
  stepNumber,
}) => {
  // 1. Define Required Values
  const requiredCalories = dailyNeeds.calories;
  const requiredProteinNIN = dailyNeeds.protein;
  const requiredProteinWeight = proteinByWeight;

  // Determine the active (higher) protein requirement for highlighting
  const activeRequiredProtein = Math.max(
    requiredProteinNIN,
    requiredProteinWeight
  ); // 2. Define Observed Values

  const observedCalories = totals.calories;
  const observedProtein = totals.protein; // --- 3. Calculate Differences (Value) ---

  const diffCalorieValue = observedCalories - requiredCalories;
  const diffProteinWeightValue = observedProtein - requiredProteinWeight;
  const diffProteinNINValue = observedProtein - requiredProteinNIN; // --- 4. Calculate Differences (%) ---
  const diffCaloriePercent =
    requiredCalories > 0 ? (diffCalorieValue / requiredCalories) * 100 : 0;

  const diffProteinWeightPercent =
    requiredProteinWeight > 0
      ? (diffProteinWeightValue / requiredProteinWeight) * 100
      : 0;

  const diffProteinNINPercent =
    requiredProteinNIN > 0
      ? (diffProteinNINValue / requiredProteinNIN) * 100
      : 0;

  // Helper for coloring the difference rows (Green for surplus/meeting, Red for deficit)
  const getDiffColorClass = (value) =>
    value >= 0 ? "text-success fw-medium" : "text-danger fw-medium";

  // Helper for coloring the Observed row (to indicate overall range)
  const getObservedColorClass = (value, required) => {
    if (required === 0) return "text-secondary";
    if (value < required * 0.95) return "text-danger fw-bold"; // Below target (5% deficit)
    return "text-primary fw-bold";
  };

  return (
    <Card className="shadow h-100">
                 {" "}
      <Card.Header className="d-flex justify-content-between align-items-center p-3 bg-secondary text-white">
                       {" "}
        <h2 className="h5 mb-0 fw-semibold">{stepNumber}. View Totals</h2>     
                 {" "}
        <Button
          variant="outline-light"
          size="sm"
          onClick={handleReset}
          className="d-flex align-items-center gap-1"
        >
                              <FiRefreshCw size={14} /> Reset All              
           {" "}
        </Button>
                   {" "}
      </Card.Header>
                 {" "}
      <Card.Body className="p-4">
                       {" "}
        {dailyNeeds.message ? (
          <Alert variant="info" className="text-center">
            {dailyNeeds.message}
          </Alert>
        ) : (
          <div className="table-responsive">
                                   {" "}
            <Table
              striped
              bordered
              hover
              size="sm"
              className="text-center mb-0"
            >
                                         {" "}
              <thead>
                                               {" "}
                <tr className="bg-light">
                                                     {" "}
                  <th
                    rowSpan="2"
                    style={{ width: "20%", verticalAlign: "middle" }}
                  ></th>
                                                     {" "}
                  <th
                    rowSpan="2"
                    style={{ width: "25%", verticalAlign: "middle" }}
                  >
                    CALORIES (kcal)
                  </th>
                                                     {" "}
                  <th colSpan="2">PROTEIN (g)</th>                             
                   {" "}
                </tr>
                <tr className="bg-light">
                  <th
                    style={{ width: "27.5%" }}
                    className="text-muted fw-normal small p-1"
                  >
                    Weight
                  </th>
                  <th
                    style={{ width: "27.5%" }}
                    className="text-muted fw-normal small p-1"
                  >
                    NIN
                  </th>
                </tr>
                                           {" "}
              </thead>
                                         {" "}
              <tbody>
                                                {/* 1. Required */}             
                                 {" "}
                <tr>
                                                     {" "}
                  <td className="fw-bold bg-light text-start">Required</td>     
                                               {" "}
                  <td className="text-primary fw-medium">
                    {requiredCalories.toFixed(0)}
                  </td>
                                                     {" "}
                  <td
                    className={
                      requiredProteinWeight === activeRequiredProtein
                        ? "fw-bold text-success"
                        : "fw-medium"
                    }
                  >
                    {requiredProteinWeight.toFixed(1)}
                  </td>
                                                     {" "}
                  <td
                    className={
                      requiredProteinNIN === activeRequiredProtein
                        ? "fw-bold text-success"
                        : "fw-medium"
                    }
                  >
                    {requiredProteinNIN.toFixed(1)}
                  </td>
                                                 {" "}
                </tr>
                                                                               {" "}
                {/* 2. Observed */}                               {" "}
                <tr>
                                                     {" "}
                  <td className="fw-bold bg-light text-start">Observed</td>     
                                               {" "}
                  <td
                    className={getObservedColorClass(
                      observedCalories,
                      requiredCalories
                    )}
                  >
                    {observedCalories.toFixed(1)}
                  </td>
                                                     {" "}
                  <td
                    colSpan="2"
                    className={getObservedColorClass(
                      observedProtein,
                      activeRequiredProtein
                    )}
                  >
                    {observedProtein.toFixed(1)}
                  </td>
                                                 {" "}
                </tr>
                                                {/* 3. Difference (Value) */}   
                                           {" "}
                <tr>
                                                     {" "}
                  <td className="fw-bold bg-light text-start">
                    Difference (Value)
                  </td>
                                                     {" "}
                  <td className={getDiffColorClass(diffCalorieValue)}>
                                                           {" "}
                    {diffCalorieValue > 0 ? "+" : ""}
                    {diffCalorieValue.toFixed(1)}                               
                       {" "}
                  </td>
                                                     {" "}
                  {/* Protein Difference vs Weight */}                         
                           {" "}
                  <td className={getDiffColorClass(diffProteinWeightValue)}>
                                                           {" "}
                    {diffProteinWeightValue > 0 ? "+" : ""}
                    {diffProteinWeightValue.toFixed(1)}                         
                             {" "}
                  </td>
                                                     {" "}
                  {/* Protein Difference vs NIN */}                             
                       {" "}
                  <td className={getDiffColorClass(diffProteinNINValue)}>
                                                           {" "}
                    {diffProteinNINValue > 0 ? "+" : ""}
                    {diffProteinNINValue.toFixed(1)}                           
                           {" "}
                  </td>
                                                 {" "}
                </tr>
                                                {/* 4. Difference (%) */}       
                                       {" "}
                <tr>
                                                     {" "}
                  <td className="fw-bold bg-light text-start">
                    Difference (%)
                  </td>
                                                     {" "}
                  <td className={getDiffColorClass(diffCaloriePercent)}>
                                                           {" "}
                    {diffCaloriePercent > 0 ? "+" : ""}
                    {diffCaloriePercent.toFixed(0)}%                            
                           {" "}
                  </td>
                                                     {" "}
                  {/* Protein Difference % vs Weight */}                       
                             {" "}
                  <td className={getDiffColorClass(diffProteinWeightPercent)}>
                                                           {" "}
                    {diffProteinWeightPercent > 0 ? "+" : ""}
                    {diffProteinWeightPercent.toFixed(0)}%                      
                                 {" "}
                  </td>
                                                     {" "}
                  {/* Protein Difference % vs NIN */}                           
                         {" "}
                  <td className={getDiffColorClass(diffProteinNINPercent)}>
                                                           {" "}
                    {diffProteinNINPercent > 0 ? "+" : ""}
                    {diffProteinNINPercent.toFixed(0)}%                        
                               {" "}
                  </td>
                                                 {" "}
                </tr>
                                           {" "}
              </tbody>
                                     {" "}
            </Table>
                               {" "}
          </div>
        )}
                   {" "}
      </Card.Body>
             {" "}
    </Card>
  );
};

// --- Component: Meal Items List (Step 2) ---
// src/components/FoodTracker.jsx (Updated MealList component only)

// ... (Other imports remain the same) ...

// --- Component: Meal Items List (Step 2) ---
export const MealList = ({ mealList, handleRemoveFood, stepNumber }) => {
    
    // Calculate max height for 5 items. 
    // py-3 roughly results in 70px per item (adjust if theme changes spacing).
    const MAX_HEIGHT_FOR_SCROLL = 5 * 70; 

  return (
    <Card className="shadow">
      <Card.Header as="h2" className="h5 fw-semibold p-3 text-white bg-info">
        {stepNumber}. Today's Meal Items
      </Card.Header>
      {mealList.length === 0 ? (
        <Card.Body>
          <p className="text-center text-muted mb-0">
            Add food items above to see them here.
          </p>
        </Card.Body>
      ) : (
        <ListGroup
          variant="flush"
          // --- FIX APPLIED HERE ---
          style={{ maxHeight: `${MAX_HEIGHT_FOR_SCROLL}px`, overflowY: "auto" }} // Set fixed height for 5 items
          // --- END OF FIX ---
        >
          {mealList.map((item) => (
            <ListGroup.Item
              key={item.id}
              action
              className="d-flex align-items-center justify-content-between px-4 py-3"
            >
              {/* Item Details (Name & Serving Size) */}
              <div className="me-2 text-truncate" style={{ flexBasis: "45%" }}>
                <p className="h6 mb-0 fw-bold text-truncate">{item.name}</p>
                <small className="text-muted">{item.optionLabel}</small>
              </div>
              
              {/* Nutritional Info & Delete Button */}
              <div className="d-flex align-items-center flex-shrink-0">
                <div className="text-end me-2 me-sm-3">
                  <p className="mb-0 fw-semibold text-success small">
                    {item.calories.toFixed(1)} kcal
                  </p>
                  <p className="mb-0 fw-semibold text-primary small">
                    {item.protein.toFixed(1)} g
                  </p>
                </div>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleRemoveFood(item)}
                  aria-label="Remove item"
                  className="p-1"
                >
                  <FiTrash2 size={14} />
                </Button>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </Card>
  );
};

// --- Main FoodTracker Component (Exported as default for Step 1) ---
const FoodTracker = (props) => {
  return <AddFood {...props} />;
};

export default FoodTracker;
