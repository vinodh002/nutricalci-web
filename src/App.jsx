// src/App.jsx (FINAL CODE WITH SIDEBAR LAYOUT)

import { useState, useMemo } from "react";
import { FiRefreshCw, FiCpu } from "react-icons/fi";
// Import React-Bootstrap components
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Alert from "react-bootstrap/Alert";

// Custom components
import NeedsCalculator from "./components/NeedsCalculator.jsx";
import FoodTracker, { Totals, MealList } from "./components/FoodTracker.jsx";
import AppFooter from "./components/AppFooter.jsx";
import AppNavbar from "./components/AppNavbar.jsx";
// Data Hook
import useFirebaseData from "./useFirebaseData.js";
import AdBanner728 from "./Ads/AdBanner728.jsx";
import SidebarAd160x600 from "./Ads/SidebarAd160x600.jsx";

// --- LOGIC (REMAINS THE SAME) ---
const getRecommendedValues = (
  age,
  gender,
  femaleStatus,
  lactationPeriod,
  workType,
  rules
) => {
  const numAge = parseFloat(age);

  if (isNaN(numAge) || numAge <= 0) {
    return { message: "Please enter a valid age." };
  }

  if (numAge < 1) {
    if (numAge * 12 < 7) {
      return { message: "Exclusive breastfeeding recommended." };
    }
    return {
      message: "Please consult a pediatrician for infants aged 7-12 months.",
    };
  }

  let targetStatus = femaleStatus;
  if (femaleStatus === "lactating") {
    targetStatus = `lactating_${lactationPeriod.replace("-", "_")}`;
  }

  const recommendation = rules.find((rule) => {
    const ruleMinAge = parseFloat(rule.minAge);
    const ruleMaxAge = parseFloat(rule.maxAge);
    const ageMatch = numAge >= ruleMinAge && numAge <= ruleMaxAge;
    const genderMatch = rule.gender === "both" || rule.gender === gender;

    let statusMatch = false;

    if (targetStatus === "pregnant" || targetStatus.startsWith("lactating_")) {
      statusMatch = rule.status === targetStatus;
    } else {
      statusMatch =
        rule.status === targetStatus ||
        (rule.status === "n/a" && targetStatus === "normal");
    }

    let workMatch = true;
    if (rule.workType !== "n/a" && rule.status === "normal") {
      workMatch = rule.workType === workType;
    }

    return ageMatch && genderMatch && statusMatch && workMatch;
  });

  if (recommendation) {
    return {
      calories: recommendation.calories,
      protein: recommendation.protein,
      message: null,
    };
  }

  return {
    message:
      "No matching RDA rule found. Please check inputs or contact support.",
  };
};

// --- END OF LOGIC ---

function App() {
  // ... (State definitions remain the same) ...
  const { foodData, recommendations, isLoading, error } = useFirebaseData();
  const [selectedFoodId, setSelectedFoodId] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [mealList, setMealList] = useState([]);
  const [totals, setTotals] = useState({ calories: 0, protein: 0 });
  const [gender, setGender] = useState("female");
  const [femaleStatus, setFemaleStatus] = useState("normal");
  const [lactationPeriod, setLactationPeriod] = useState("0-6m");
  const [workType, setWorkType] = useState("sedentary");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [dailyNeeds, setDailyNeeds] = useState({
    calories: 0,
    protein: 0,
    message: null,
  });
  const [proteinByWeight, setProteinByWeight] = useState(0);

  const currentFood = useMemo(() => {
    return foodData.find((food) => food.id === selectedFoodId);
  }, [selectedFoodId, foodData]);

  const currentOptions = currentFood ? currentFood.options : [];

  // ... (Handlers and Derived States remain the same) ...
  const handleCalculateNeeds = () => {
    const numAge = parseFloat(age);
    const numWeight = parseFloat(weight);
    if (isNaN(numAge) || numAge <= 0) {
      alert("Please enter a valid age.");
      return;
    }
    const recommendationsResult = getRecommendedValues(
      numAge,
      gender,
      femaleStatus,
      lactationPeriod,
      workType,
      recommendations
    );

    setDailyNeeds({
      calories: recommendationsResult.calories || 0,
      protein: recommendationsResult.protein || 0,
      message: recommendationsResult.message || null,
    });
    if (!isNaN(numWeight) && numWeight > 0 && numAge >= 18) {
      setProteinByWeight(numWeight * 0.8);
    } else {
      setProteinByWeight(0);
    }
  };

  const handleAddFood = () => {
    const optionObj = currentOptions.find(
      (opt) => opt.multiplier.toString() === selectedOption
    );
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
    setMealList((prevList) => [...prevList, newItem]);
    setTotals((prevTotals) => ({
      calories: prevTotals.calories + calories,
      protein: prevTotals.protein + protein,
    }));
    setSelectedFoodId("");
    setSelectedOption("");
  };

  const handleRemoveFood = (itemToRemove) => {
    setMealList((prevList) =>
      prevList.filter((item) => item.id !== itemToRemove.id)
    );
    setTotals((prevTotals) => ({
      calories: prevTotals.calories - itemToRemove.calories,
      protein: prevTotals.protein - itemToRemove.protein,
    }));
  };

  const handleReset = () => {
    setMealList([]);
    setTotals({ calories: 0, protein: 0 });
    setSelectedFoodId("");
    setSelectedOption("");
    setAge("");
    setWeight("");
    setGender("female");
    setFemaleStatus("normal");
    setLactationPeriod("0-6m");
    setWorkType("sedentary");
    setDailyNeeds({ calories: 0, protein: 0, message: null });
    setProteinByWeight(0);
  };

  const numAge = parseFloat(age);
  const showFemaleStatus = gender === "female" && numAge >= 14 && numAge <= 50;
  const showLactationPeriod = showFemaleStatus && femaleStatus === "lactating";
  const showWorkType =
    (gender === "male" && numAge > 18 && numAge <= 60) ||
    (gender === "female" &&
      femaleStatus === "normal" &&
      numAge >= 14 &&
      numAge <= 60); // --- Loading and Error State Handling (omitted for brevity) ---

  if (isLoading || recommendations.length === 0) {
    return (
      <Container className="my-5 text-center">
                <h1 className="text-primary">Loading Data... ⏳</h1>           {" "}
               {" "}
        <p className="lead">
                    Fetching latest nutritional guidelines and food items.      
           {" "}
        </p>
                           {" "}
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
                               {" "}
        <Alert variant="danger" className="text-center">
                             {" "}
          <h4 className="alert-heading">Data Fetch Error! 🛑</h4>               
                    <p>Could not load data from Firebase: {error}</p>
                              <hr />                             {" "}
          <p className="mb-0">
                        Please check your Firebase configuration and network
            connection.          {" "}
          </p>
                                   {" "}
        </Alert>
                           {" "}
      </Container>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100">
            <AppNavbar />           {" "}
      <Container
        className="my-4 my-md-5 flex-grow-1"
        style={{ maxWidth: "1200px" }}
      >
        {/* 🛑 MAIN LAYOUT: SPLIT INTO CONTENT (8) AND SIDEBAR (4) */}
        <Row>
          {/* 🛑 LEFT COLUMN: MAIN CALCULATOR CONTENT (8/12) */}
          <Col md={12} lg={8}>
            {/* 1. INSTRUCTIONAL DESCRIPTION */}
            <Row className="justify-content-center mb-4">
              <Col xs={12}>
                <Alert
                  variant="light"
                  className="p-4 shadow-sm border-0 bg-light"
                >
                  <h2 className="h4 text-success mb-3">
                    Welcome to Nutri Calci
                  </h2>
                  <p className="fw-medium text-dark">
                    This application is designed to help doctors, nutritionists,
                    and enthusiasts quickly calculate and track daily Calorie
                    and Protein requirements based on the latest authoritative
                    guidelines from the National Institute of Nutrition (NIN).
                  </p>
                  <hr className="my-3" />
                  <p className="fw-semibold mb-2">
                    Follow the steps below to manage your intake:
                  </p>
                  <ol className="list-unstyled mb-0 small ps-3">
                    <li>
                      <span className="text-primary fw-bold">
                        1. Add Meals:
                      </span>{" "}
                      Select food items and serving sizes to build your meal
                      list.
                    </li>
                    <li>
                      <span className="text-primary fw-bold">
                        2. View Totals:
                      </span>{" "}
                      See the running total of calories and protein consumed.
                    </li>
                    <li>
                      <span className="text-primary fw-bold">
                        3. Calculate Needs:
                      </span>{" "}
                      Input age, gender, and status to determine your NIN-based
                      targets.
                    </li>
                    <li>
                      <span className="text-primary fw-bold">
                        4. Compare against Targets:
                      </span>{" "}
                      View the difference between your consumption and your
                      required daily needs.
                    </li>
                  </ol>
                </Alert>
              </Col>
            </Row>

            {/* 🛑 PLACEMENT 1: HORIZONTAL BANNER (728x90) */}
            <Row className="justify-content-center mb-4">
              <Col xs={12}>
                <AdBanner728 />
              </Col>
            </Row>

            {/* 1. Add Food to Meal (Step 1) */}
            <Card className="shadow mb-4">
              <FoodTracker
                foodData={foodData}
                selectedFoodId={selectedFoodId}
                setSelectedFoodId={setSelectedFoodId}
                selectedOption={selectedOption}
                setSelectedOption={setSelectedOption}
                currentOptions={currentOptions}
                handleAddFood={handleAddFood}
                stepNumber={1}
              />
            </Card>

            {/* 2. Today's Meal Items (Step 2) */}
            <div className="mb-4">
              <MealList
                mealList={mealList}
                handleRemoveFood={handleRemoveFood}
                stepNumber={2}
              />
            </div>

            {/* 3. Calculate Daily Needs (Step 3) */}
            <div className="mb-4">
              <NeedsCalculator
                age={age}
                setAge={setAge}
                weight={weight}
                setWeight={setWeight}
                gender={gender}
                setGender={setGender}
                femaleStatus={femaleStatus}
                setFemaleStatus={setFemaleStatus}
                lactationPeriod={lactationPeriod}
                setLactationPeriod={setLactationPeriod}
                workType={workType}
                setWorkType={setWorkType}
                handleCalculateNeeds={handleCalculateNeeds}
                showFemaleStatus={showFemaleStatus}
                showLactationPeriod={showLactationPeriod}
                showWorkType={showWorkType}
                stepNumber={3}
              />
            </div>

            {/* 4. View Totals (Step 4) */}
            <div className="mb-4">
              <Totals
                dailyNeeds={dailyNeeds}
                totals={totals}
                proteinByWeight={proteinByWeight}
                handleReset={handleReset}
                stepNumber={4}
              />
            </div>
          </Col>

          {/* 🛑 RIGHT COLUMN: SIDEBAR AD (4/12, Hidden on small screens) */}
          <Col lg={4} className="d-none d-lg-block">
            <div className="sticky-top pt-5" style={{ top: "60px" }}>
              {/* 🛑 SIDEBAR AD PLACEMENT: Use the 160x600 component here */}
              <SidebarAd160x600 />
            </div>
          </Col>
        </Row>
             {" "}
      </Container>
      <AdBanner728 />
      <AppFooter />
    </div>
  );
}

export default App;
