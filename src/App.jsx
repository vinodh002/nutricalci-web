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

// Data Hook
import useFirebaseData from "./useFirebaseData.js";

// --- LOGIC (UPDATED TO USE DYNAMIC RECOMMENDATIONS ARRAY) ---
const getRecommendedValues = (
  age,
  gender,
  femaleStatus,
  lactationPeriod,
  workType,
  rules // <--- DYNAMIC RULES ARRAY PASSED HERE
) => {
  if (age < 1) {
    if (age * 12 < 7) {
      return { message: "Exclusive breastfeeding recommended." };
    }
    return {
      message: "Please consult a pediatrician for infants aged 7-12 months.",
    };
  }

  // Find the matching rule in the fetched array
  const recommendation = rules.find((rule) => {
    const ageMatch = age >= rule.minAge && age <= rule.maxAge;
    const genderMatch = rule.gender === "both" || rule.gender === gender;

    let statusMatch = true;
    if (gender === "female" || rule.gender === "both") {
      // 1. Check for normal/baseline (n/a status in rule means baseline)
      if (rule.status === "n/a" && femaleStatus === "normal") {
        statusMatch = true;
      }
      // 2. Handle specific status (pregnant/lactating)
      else if (rule.status !== "n/a" && rule.status === femaleStatus) {
        if (femaleStatus === "lactating") {
          // Check lactation period only if lactating
          return (
            ageMatch && genderMatch && rule.lactationPeriod === lactationPeriod
          );
        }
        statusMatch = true;
      }
      // 3. Discard non-matching specific status rules
      else if (rule.status !== femaleStatus && rule.status !== "both") {
        statusMatch = false;
      }
    }

    // Match work type (only relevant for adult rules)
    let workMatch = true;
    if (rule.workType !== "n/a") {
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
    message: "Please check the inputs. The combination is not covered.",
  };
};
// --- END OF DYNAMIC LOGIC ---

function App() {
  // Use the hook and capture the recommendations array
  const { foodData, recommendations, isLoading, error } = useFirebaseData(); // --- STATE ---

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

  const currentOptions = currentFood ? currentFood.options : []; // --- HANDLERS (UPDATED to pass recommendations) ---

  const handleCalculateNeeds = () => {
    const numAge = parseFloat(age);
    const numWeight = parseFloat(weight);
    if (isNaN(numAge) || numAge <= 0) {
      alert("Please enter a valid age.");
      return;
    }

    // Pass the dynamic rules fetched from Firebase
    const recommendationsResult = getRecommendedValues(
      numAge,
      gender,
      femaleStatus,
      lactationPeriod,
      workType,
      recommendations // <--- PASSING DYNAMIC DATA
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
  }; // --- Derived States ---

  const numAge = parseFloat(age);
  const showFemaleStatus = gender === "female" && numAge >= 14 && numAge <= 50;
  const showLactationPeriod = showFemaleStatus && femaleStatus === "lactating";
  const showWorkType =
    (gender === "male" && numAge > 18 && numAge <= 60) ||
    (gender === "female" &&
      femaleStatus === "normal" &&
      numAge >= 14 &&
      numAge <= 60); // --- Loading and Error State Handling --- // Check if loading is true OR if recommendations array is empty (meaning rules haven't loaded yet)

  if (isLoading || recommendations.length === 0) {
    return (
      <Container className="my-5 text-center">
                <h1 className="text-primary">Loading... ⏳</h1> 
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
               {" "}
        <Alert variant="danger" className="text-center">
                    <h4 className="alert-heading">Data Fetch Error! 🛑</h4>     
              <p>Could not load data from Firebase: **{error}**</p>
                    <hr />         {" "}
          <p className="mb-0">
                        Please check your Firebase configuration and network
            connection.          {" "}
          </p>
                 {" "}
        </Alert>
             {" "}
      </Container>
    );
  } // --- Main Render (Single Column Layout) ---

  return (
    <div className="d-flex flex-column min-vh-100">
           {" "}
      <Container
        className="my-4 my-md-5 flex-grow-1"
        style={{ maxWidth: "1200px" }}
      >
               {" "}
        <header className="text-center mb-5">
                   {" "}
          <h1
            className="display-4 fw-bold text-success"
            style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.1)" }}
          >
                        Nutri Calci {" "}
            <span style={{ fontSize: "0.8em" }}>🩺</span>         {" "}
          </h1>
                   {" "}
          <p className="lead text-muted">Doctor-Friendly Meal Calculator</p>   
             {" "}
        </header>
                {/* Single Column Container, centered for wider screens */}     
         {" "}
        <Row className="justify-content-center">
                   {" "}
          <Col md={10} lg={8}>
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
                     {" "}
          </Col>
                 {" "}
        </Row>
             {" "}
      </Container>
            <AppFooter />   {" "}
    </div>
  );
}

export default App;
