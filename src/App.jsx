import { useState, useMemo } from 'react';
import { foodData } from './foodData.js';
import { FiPlus, FiTrash2, FiRefreshCw, FiCpu } from 'react-icons/fi';

// Import React-Bootstrap components
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Alert from 'react-bootstrap/Alert';

// --- LOGIC (EXACTLY THE SAME) ---
const getRecommendedValues = (age, gender, femaleStatus, lactationPeriod, workType) => {
  if (age < 1) {
    if (age * 12 < 7) {
      return { message: "Exclusive breastfeeding recommended." };
    }
    return { message: "Please consult a pediatrician for infants aged 7-12 months." };
  }
  if (age <= 3) return { calories: 1110, protein: 38 };
  if (age <= 6) return { calories: 1370, protein: 46 };
  if (age <= 9) return { calories: 1710, protein: 59 };
  if (age <= 12) {
    if (gender === 'male') return { calories: 2230, protein: 76 };
    if (gender === 'female') return { calories: 2060, protein: 70 };
  }
  if (age <= 15) {
    if (gender === 'male') return { calories: 2860, protein: 95 };
    if (gender === 'female') {
      if (age >= 14 && (femaleStatus === 'pregnant' || femaleStatus === 'lactating')) {
        if (femaleStatus === 'pregnant') return { calories: 2020, protein: 72 };
        if (femaleStatus === 'lactating') {
          if (lactationPeriod === '0-6m') return { calories: 2245, protein: 77 };
          if (lactationPeriod === '7-12m') return { calories: 2200, protein: 78 };
        }
      }
      return { calories: 2410, protein: 81 };
    }
  }
  if (age <= 18) {
    if (gender === 'male') return { calories: 3300, protein: 107 };
    if (gender === 'female') {
      if (femaleStatus === 'pregnant' || femaleStatus === 'lactating') {
        if (femaleStatus === 'pregnant') return { calories: 2020, protein: 72 };
        if (femaleStatus === 'lactating') {
          if (lactationPeriod === '0-6m') return { calories: 2245, protein: 77 };
          if (lactationPeriod === '7-12m') return { calories: 2200, protein: 78 };
        }
      }
      return { calories: 2490, protein: 85 };
    }
  }
  if (age <= 60) {
    if (gender === 'male') {
      if (workType === 'sedentary') return { calories: 1900, protein: 64 };
      if (workType === 'moderate') return { calories: 2400, protein: 82 };
    }
    if (gender === 'female') {
      if (age <= 50 && (femaleStatus === 'pregnant' || femaleStatus === 'lactating')) {
        if (femaleStatus === 'pregnant') return { calories: 2020, protein: 72 };
        if (femaleStatus === 'lactating') {
          if (lactationPeriod === '0-6m') return { calories: 2245, protein: 77 };
          if (lactationPeriod === '7-12m') return { calories: 2200, protein: 78 };
        }
      }
      if (workType === 'sedentary') return { calories: 1660, protein: 58.5 };
      if (workType === 'moderate') return { calories: 2125, protein: 68 };
    }
  }
  if (age > 60) {
    if (gender === 'male') return { calories: 1740, protein: 62 };
    if (gender === 'female') return { calories: 1530, protein: 56 };
  }
  return { message: "Please check the inputs. The combination is not covered." };
};
// --- END OF LOGIC ---

function App() {
  // --- STATE (EXACTLY THE SAME) ---
  const [selectedFoodId, setSelectedFoodId] = useState('');
  const [selectedOption, setSelectedOption] = useState(''); 
  const [mealList, setMealList] = useState([]);
  const [totals, setTotals] = useState({ calories: 0, protein: 0 });
  const [gender, setGender] = useState('female');
  const [femaleStatus, setFemaleStatus] = useState('normal'); 
  const [lactationPeriod, setLactationPeriod] = useState('0-6m'); 
  const [workType, setWorkType] = useState('sedentary'); 
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState(''); 
  const [dailyNeeds, setDailyNeeds] = useState({ calories: 0, protein: 0, message: null });
  const [proteinByWeight, setProteinByWeight] = useState(0);

  const currentFood = useMemo(() => {
    return foodData.find(food => food.id === selectedFoodId);
  }, [selectedFoodId]);

  const currentOptions = currentFood ? currentFood.options : [];

  // --- HANDLERS (EXACTLY THE SAME) ---
  const handleCalculateNeeds = () => {
    const numAge = parseFloat(age);
    const numWeight = parseFloat(weight);
    if (isNaN(numAge) || numAge <= 0) {
      alert("Please enter a valid age.");
      return;
    }
    const recommendations = getRecommendedValues(numAge, gender, femaleStatus, lactationPeriod, workType);
    setDailyNeeds({
      calories: recommendations.calories || 0,
      protein: recommendations.protein || 0,
      message: recommendations.message || null
    });
    if (!isNaN(numWeight) && numWeight > 0 && numAge >= 18) {
      setProteinByWeight(numWeight * 0.8);
    } else {
      setProteinByWeight(0);
    }
  };

  const handleAddFood = () => {
    const optionObj = currentOptions.find(opt => opt.multiplier.toString() === selectedOption);
    if (!currentFood || !optionObj) return; 
    const calories = currentFood.calories * optionObj.multiplier;
    const protein = currentFood.protein * optionObj.multiplier;
    const newItem = {
      id: Date.now(), 
      name: currentFood.name,
      optionLabel: optionObj.label,
      calories: calories,
      protein: protein,
    };
    setMealList(prevList => [...prevList, newItem]);
    setTotals(prevTotals => ({
      calories: prevTotals.calories + calories,
      protein: prevTotals.protein + protein,
    }));
    setSelectedFoodId('');
    setSelectedOption('');
  };

  const handleRemoveFood = (itemToRemove) => {
    setMealList(prevList => prevList.filter(item => item.id !== itemToRemove.id));
    setTotals(prevTotals => ({
      calories: prevTotals.calories - itemToRemove.calories,
      protein: prevTotals.protein - itemToRemove.protein,
    }));
  };

  const handleReset = () => {
    setMealList([]);
    setTotals({ calories: 0, protein: 0 });
    setSelectedFoodId('');
    setSelectedOption('');
    setAge('');
    setWeight('');
    setGender('female');
    setFemaleStatus('normal');
    setLactationPeriod('0-6m');
    setWorkType('sedentary');
    setDailyNeeds({ calories: 0, protein: 0, message: null });
    setProteinByWeight(0);
  };

  const numAge = parseFloat(age);
  const showFemaleStatus = gender === 'female' && numAge >= 14 && numAge <= 50;
  const showLactationPeriod = showFemaleStatus && femaleStatus === 'lactating';
  const showWorkType = 
    (gender === 'male' && numAge > 18 && numAge <= 60) ||
    (gender === 'female' && femaleStatus === 'normal' && numAge >= 14 && numAge <= 60);
  // --- END OF STATE & HANDLERS ---

  // --- NEW BOOTSTRAP JSX ---
  return (
    // LAYOUT: Widened container
    <Container className="my-4 my-md-5" style={{ maxWidth: '1200px' }}>
      <header className="text-center mb-5">
        <h1 className="display-4 fw-bold text-success" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.1)' }}>
          Nutri Calci <span style={{fontSize: '0.8em'}}>🩺</span>
        </h1>
        <p className="lead text-muted">Doctor-Friendly Meal Calculator</p>
      </header>

      {/* LAYOUT: This Row wraps all 4 cards into a 2x2 grid */}
      <Row>

        {/* --- CARD 1: Daily Needs --- */}
        {/* LAYOUT: Added Col md={6} wrapper */}
        <Col md={6} className="mb-4">
          {/* LAYOUT: Added h-100 for equal height */}
          <Card className="shadow h-100">
            <Card.Header as="h2" className="h5 fw-semibold p-3">1. Calculate Daily Needs</Card.Header>
            <Card.Body className="p-4">
              <Row className="mb-3">
                <Form.Group as={Col} md={4} controlId="age">
                  <Form.Label>Age (years)</Form.Label>
                  <Form.Control type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="e.g., 35" />
                </Form.Group>
                <Form.Group as={Col} md={4} controlId="weight">
                  <Form.Label>Weight (kg)</Form.Label>
                  <Form.Control type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="e.g., 60" />
                </Form.Group>
                <Form.Group as={Col} md={4} controlId="gender">
                  <Form.Label>Gender</Form.Label>
                  <Form.Select value={gender} onChange={(e) => setGender(e.target.value)}>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                  </Form.Select>
                </Form.Group>
              </Row>
              <Row>
                {showFemaleStatus && (
                  <Form.Group as={Col} md={4} controlId="femaleStatus" className="mb-3">
                    <Form.Label>Condition</Form.Label>
                    <Form.Select value={femaleStatus} onChange={(e) => setFemaleStatus(e.target.value)}>
                      <option value="normal">Normal</option>
                      <option value="pregnant">Pregnant</option>
                      <option value="lactating">Lactating</option>
                    </Form.Select>
                  </Form.Group>
                )}
                {showLactationPeriod && (
                  <Form.Group as={Col} md={4} controlId="lactationPeriod" className="mb-3">
                    <Form.Label>Lactating Period</Form.Label>
                    <Form.Select value={lactationPeriod} onChange={(e) => setLactationPeriod(e.target.value)}>
                      <option value="0-6m">0-6 Months</option>
                      <option value="7-12m">7-12 Months</option>
                    </Form.Select>
                  </Form.Group>
                )}
                {showWorkType && (
                  <Form.Group as={Col} md={4} controlId="workType" className="mb-3">
                    <Form.Label>Type of Work</Form.Label>
                    <Form.Select value={workType} onChange={(e) => setWorkType(e.target.value)}>
                      <option value="sedentary">Sedentary</option>
                      <option value="moderate">Moderate</option>
                    </Form.Select>
                  </Form.Group>
                )}
              </Row>
              <div className="d-grid pt-2">
                <Button variant="primary" onClick={handleCalculateNeeds} className="d-flex align-items-center justify-content-center gap-2 fw-semibold">
                  <FiCpu /> Calculate Needs
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* --- CARD 2: Add Food --- */}
        {/* LAYOUT: Added Col md={6} wrapper */}
        <Col md={6} className="mb-4">
          {/* LAYOUT: Added h-100 for equal height */}
          <Card className="shadow h-100">
            <Card.Header as="h2" className="h5 fw-semibold p-3">2. Add Food to Meal</Card.Header>
            <Card.Body className="p-4">
              <Row>
                <Form.Group as={Col} md={6} controlId="food-select" className="mb-3 mb-md-0">
                  <Form.Label>Food Item</Form.Label>
                  <Form.Select value={selectedFoodId} onChange={(e) => { setSelectedFoodId(e.target.value); setSelectedOption(''); }}>
                    <option value="" disabled>-- Select a food --</option>
                    {foodData.map(food => (
                      <option key={food.id} value={food.id}>{food.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group as={Col} md={6} controlId="option-select">
                  <Form.Label>Serving Size</Form.Label>
                  <Form.Select value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)} disabled={!selectedFoodId}>
                    <option value="" disabled>-- Select a serving --</option>
                    {currentOptions.map(opt => (
                      <option key={opt.label} value={opt.multiplier}>{opt.label}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Row>
              <div className="d-grid mt-3 pt-2">
                <Button variant="success" onClick={handleAddFood} disabled={!selectedFoodId || !selectedOption} className="d-flex align-items-center justify-content-center gap-2 fw-semibold">
                  <FiPlus /> Add to Meal
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* --- CARD 3: View Totals --- */}
        {/* LAYOUT: Added Col md={6} wrapper */}
        <Col md={6} className="mb-4">
          <Card className="shadow">
            <Card.Header className="d-flex justify-content-between align-items-center p-3">
              <h2 className="h5 mb-0 fw-semibold">3. View Totals</h2>
              <Button variant="outline-danger" size="sm" onClick={handleReset} className="d-flex align-items-center gap-1">
                <FiRefreshCw size={14} /> Reset All
              </Button>
            </Card.Header>
            <Card.Body className="p-4">
              {dailyNeeds.message ? (
                <Alert variant="info" className="text-center">{dailyNeeds.message}</Alert>
              ) : (
                <Row>
                  <Col md={6} className="mb-3 mb-md-0">
                    <Card className="text-center h-100 border-success-subtle">
                      <Card.Header className="bg-success-subtle text-success-emphasis fw-semibold">Calories (kcal)</Card.Header>
                      <Card.Body className="p-4">
                        <h3 className="display-5 fw-bold text-success">{totals.calories.toFixed(1)}</h3>
                        <hr />
                        <div className="d-flex justify-content-between">
                          <span className="text-muted">Goal:</span>
                          <span className="fw-medium">{dailyNeeds.calories.toFixed(1)}</span>
                        </div>
                        <div className="d-flex justify-content-between">
                          <span className="text-muted">Remaining:</span>
                          <span className={`fw-bold ${dailyNeeds.calories - totals.calories < 0 ? 'text-danger' : ''}`}>
                            {(dailyNeeds.calories - totals.calories).toFixed(1)}
                          </span>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6}>
                    <Card className="text-center h-100 border-primary-subtle">
                      <Card.Header className="bg-primary-subtle text-primary-emphasis fw-semibold">Protein (g)</Card.Header>
                      <Card.Body className="p-4">
                        <h3 className="display-5 fw-bold text-primary">{totals.protein.toFixed(1)}</h3>
                        <hr />
                        <div className="d-flex justify-content-between">
                          <span className="text-muted">Goal (NIN):</span>
                          <span className="fw-medium">{dailyNeeds.protein.toFixed(1)}</span>
                        </div>
                        {proteinByWeight > 0 && (
                          <div className="d-flex justify-content-between">
                            <span className="text-muted">Goal (Weight):</span>
                            <span className="fw-medium">{proteinByWeight.toFixed(1)}</span>
                          </div>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* --- CARD 4: Meal Items --- */}
        {/* LAYOUT: Added Col md={6} wrapper */}
        <Col md={6} className="mb-4">
          <Card className="shadow">
            <Card.Header as="h2" className="h5 fw-semibold p-3">Today's Meal Items</Card.Header>
            {mealList.length === 0 ? (
              <Card.Body>
                <p className="text-center text-muted mb-0">Add food items above to see them here.</p>
              </Card.Body>
            ) : (
              // LAYOUT: Added scrollable style to ListGroup
              <ListGroup variant="flush" style={{ maxHeight: '450px', overflowY: 'auto' }}>
                {mealList.map(item => (
                  <ListGroup.Item key={item.id} action className="d-flex flex-column flex-md-row justify-content-between align-items-md-center px-4 py-3">
                    <div className="mb-2 mb-md-0">
                      <p className="h6 mb-0">{item.name}</p>
                      <small className="text-muted">{item.optionLabel}</small>
                    </div>
                    <div className="d-flex align-items-center">
                      <div className="text-end me-3">
                        <p className="mb-0 fw-semibold text-success">{item.calories.toFixed(1)} kcal</p>
                        <p className="mb-0 fw-semibold text-primary">{item.protein.toFixed(1)} g</p>
                      </div>
                      <Button variant="outline-danger" size="sm" onClick={() => handleRemoveFood(item)} aria-label="Remove item">
                        <FiTrash2 />
                      </Button>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Card>
        </Col>

      </Row> {/* LAYOUT: End of the 2x2 grid Row */}

    </Container>
  );
}

export default App;