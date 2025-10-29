import { useState, useMemo } from "react";
import { FiRefreshCw, FiCpu } from "react-icons/fi";
// Import React-Bootstrap components
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Alert from "react-bootstrap/Alert";

// Custom components (Named exports are imported using destructured braces)
import NeedsCalculator from "./components/NeedsCalculator.jsx";
import FoodTracker, { Totals, MealList } from "./components/FoodTracker.jsx";
import AppFooter from "./components/AppFooter.jsx";

// Data Hook (Requires useFirebaseData.js and firebaseConfig.js to be implemented)
import useFirebaseData from "./useFirebaseData.js";

// --- LOGIC (NIN Calculation) ---
const getRecommendedValues = (
  age,
  gender,
  femaleStatus,
  lactationPeriod,
  workType
) => {
  if (age < 1) {
    if (age * 12 < 7) {
      return { message: "Exclusive breastfeeding recommended." };
    }
    return {
      message: "Please consult a pediatrician for infants aged 7-12 months.",
    };
  }
  if (age <= 3) return { calories: 1110, protein: 38 };
  if (age <= 6) return { calories: 1370, protein: 46 };
  if (age <= 9) return { calories: 1710, protein: 59 };
  if (age <= 12) {
    if (gender === "male") return { calories: 2230, protein: 76 };
    if (gender === "female") return { calories: 2060, protein: 70 };
  }
  if (age <= 15) {
    if (gender === "male") return { calories: 2860, protein: 95 };
    if (gender === "female") {
      if (
        age >= 14 &&
        (femaleStatus === "pregnant" || femaleStatus === "lactating")
      ) {
        if (femaleStatus === "pregnant") return { calories: 2020, protein: 72 };
        if (femaleStatus === "lactating") {
          if (lactationPeriod === "0-6m")
            return { calories: 2245, protein: 77 };
          if (lactationPeriod === "7-12m")
            return { calories: 2200, protein: 78 };
        }
      }
      return { calories: 2410, protein: 81 };
    }
  }
  if (age <= 18) {
    if (gender === "male") return { calories: 3300, protein: 107 };
    if (gender === "female") {
      if (femaleStatus === "pregnant" || femaleStatus === "lactating") {
        if (femaleStatus === "pregnant") return { calories: 2020, protein: 72 };
        if (femaleStatus === "lactating") {
          if (lactationPeriod === "0-6m")
            return { calories: 2245, protein: 77 };
          if (lactationPeriod === "7-12m")
            return { calories: 2200, protein: 78 };
        }
      }
      return { calories: 2490, protein: 85 };
    }
  }
  if (age <= 60) {
    if (gender === "male") {
      if (workType === "sedentary") return { calories: 1900, protein: 64 };
      if (workType === "moderate") return { calories: 2400, protein: 82 };
    }
    if (gender === "female") {
      if (
        age <= 50 &&
        (femaleStatus === "pregnant" || femaleStatus === "lactating")
      ) {
        if (femaleStatus === "pregnant") return { calories: 2020, protein: 72 };
        if (femaleStatus === "lactating") {
          if (lactationPeriod === "0-6m")
            return { calories: 2245, protein: 77 };
          if (lactationPeriod === "7-12m")
            return { calories: 2200, protein: 78 };
        }
      }
      if (workType === "sedentary") return { calories: 1660, protein: 58.5 };
      if (workType === "moderate") return { calories: 2125, protein: 68 };
    }
  }
  if (age > 60) {
    if (gender === "male") return { calories: 1740, protein: 62 };
    if (gender === "female") return { calories: 1530, protein: 56 };
  }
  return {
    message: "Please check the inputs. The combination is not covered.",
  };
};
// --- END OF LOGIC ---

function App() {
  const { foodData, isLoading, error } = useFirebaseData(); // --- STATE ---
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

  const currentOptions = currentFood ? currentFood.options : []; // --- HANDLERS ---

  const handleCalculateNeeds = () => {
    const numAge = parseFloat(age);
    const numWeight = parseFloat(weight);
    if (isNaN(numAge) || numAge <= 0) {
      alert("Please enter a valid age.");
      return;
    }
    const recommendations = getRecommendedValues(
      numAge,
      gender,
      femaleStatus,
      lactationPeriod,
      workType
    );
    setDailyNeeds({
      calories: recommendations.calories || 0,
      protein: recommendations.protein || 0,
      message: recommendations.message || null,
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
      numAge <= 60); // --- Loading and Error State Handling ---

  if (isLoading) {
    return (
      <Container className="my-5 text-center">
                <h1 className="text-primary">Loading Food Data... ⏳</h1>       {" "}
        <p className="lead">Connecting to Firebase Firestore...</p>     {" "}
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
               {" "}
        <Alert variant="danger" className="text-center">
                    <h4 className="alert-heading">Data Fetch Error! 🛑</h4>     
              <p>Could not load food data from Firebase: **{error}**</p>
                    <hr />         {" "}
          <p className="mb-0">
            Please check your Firebase configuration and network connection.
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
                        Nutri Calci{" "}
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
