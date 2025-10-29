// src/components/NeedsCalculator.jsx

import React from "react";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { FiCpu } from "react-icons/fi";

const NeedsCalculator = ({
  age,
  setAge,
  weight,
  setWeight,
  gender,
  setGender,
  femaleStatus,
  setFemaleStatus,
  lactationPeriod,
  setLactationPeriod,
  workType,
  setWorkType,
  handleCalculateNeeds,
  showFemaleStatus,
  showLactationPeriod,
  showWorkType,
  stepNumber, // Added stepNumber
}) => {
  return (
    <Card className="shadow">
      <Card.Header as="h2" className="h5 fw-semibold p-3 text-white bg-primary">
        {stepNumber}. Calculate Daily Needs
      </Card.Header>
      <Card.Body className="p-4">
        <Row className="mb-3">
          <Form.Group as={Col} md={4} controlId="age">
            <Form.Label className="fw-medium">Age (years)</Form.Label>
            <Form.Control
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="e.g., 35"
            />
          </Form.Group>
          <Form.Group as={Col} md={4} controlId="weight">
            <Form.Label className="fw-medium">Weight (kg)</Form.Label>
            <Form.Control
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="e.g., 60"
            />
          </Form.Group>
          <Form.Group as={Col} md={4} controlId="gender">
            <Form.Label className="fw-medium">Gender</Form.Label>
            <Form.Select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="female">Female</option>
              <option value="male">Male</option>
            </Form.Select>
          </Form.Group>
        </Row>
        <Row>
          {showFemaleStatus && (
            <Form.Group
              as={Col}
              md={4}
              controlId="femaleStatus"
              className="mb-3"
            >
              <Form.Label className="fw-medium">Condition</Form.Label>
              <Form.Select
                value={femaleStatus}
                onChange={(e) => setFemaleStatus(e.target.value)}
              >
                <option value="normal">Normal</option>
                <option value="pregnant">Pregnant</option>
                <option value="lactating">Lactating</option>
              </Form.Select>
            </Form.Group>
          )}
          {showLactationPeriod && (
            <Form.Group
              as={Col}
              md={4}
              controlId="lactationPeriod"
              className="mb-3"
            >
              <Form.Label className="fw-medium">Lactating Period</Form.Label>
              <Form.Select
                value={lactationPeriod}
                onChange={(e) => setLactationPeriod(e.target.value)}
              >
                <option value="0-6m">0-6 Months</option>
                <option value="7-12m">7-12 Months</option>
              </Form.Select>
            </Form.Group>
          )}
          {showWorkType && (
            <Form.Group as={Col} md={4} controlId="workType" className="mb-3">
              <Form.Label className="fw-medium">Type of Work</Form.Label>
              <Form.Select
                value={workType}
                onChange={(e) => setWorkType(e.target.value)}
              >
                <option value="sedentary">Sedentary</option>
                <option value="moderate">Moderate</option>
              </Form.Select>
            </Form.Group>
          )}
        </Row>
        <div className="d-grid pt-2">
          <Button
            variant="primary"
            onClick={handleCalculateNeeds}
            className="d-flex align-items-center justify-content-center gap-2 fw-semibold"
          >
            <FiCpu /> Calculate Needs
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default NeedsCalculator;
