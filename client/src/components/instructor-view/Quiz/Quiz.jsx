import React, { useState, useEffect } from "react";

const Quiz = () => {
  const [quizData, setQuizData] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    courseId: "",
    createdBy: "",
    questions: [],
  });
  const [quizzes, setQuizzes] = useState([]);
  const [editingQuizId, setEditingQuizId] = useState(null);
  const [newQuestion, setNewQuestion] = useState({
    text: "",
    type: "MCQ",
    options: ["", "", "", ""],
    correctAnswer: "",
    points: 1,
  });
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchUpcomingQuizzes();
  }, []);

  const fetchUpcomingQuizzes = async () => {
    const response = await fetch("http://localhost:5000/instructor/course/quizzes/upcoming");
    const data = await response.json();
    if (response.ok) {
      setQuizzes(data.quizzes);
    }
  };

  const handleChange = (e) => {
    setQuizData({ ...quizData, [e.target.name]: e.target.value });
  };

  const handleQuestionChange = (e) => {
    setNewQuestion({ ...newQuestion, [e.target.name]: e.target.value });
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions[index] = value;
    setNewQuestion({ ...newQuestion, options: updatedOptions });
  };

  const addQuestion = () => {
    setQuizData({ ...quizData, questions: [...quizData.questions, newQuestion] });
    setNewQuestion({ text: "", type: "MCQ", options: ["", "", "", ""], correctAnswer: "", points: 1 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingQuizId
      ? `http://localhost:5000/instructor/course/${editingQuizId}/questions`
      : "http://localhost:5000/instructor/course/";
    const method = editingQuizId ? "PUT" : "POST";  

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quizData),
    });

    const data = await response.json();
    if (response.ok) {
      setSuccessMessage(editingQuizId ? "✅ Quiz updated successfully!" : "✅ Quiz created successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      setQuizData({
        title: "",
        description: "",
        startTime: "",
        endTime: "",
        courseId: "",
        createdBy: "",
        questions: [],
      });
      setEditingQuizId(null);
      fetchUpcomingQuizzes();
    }
  };

  const handleEdit = (quiz) => {
    setQuizData(quiz);
    setEditingQuizId(quiz._id);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/instructor/course/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,  // Add token here
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete quiz");
      }
  
      setSuccessMessage("✅ Quiz deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      fetchUpcomingQuizzes();
    } catch (error) {
      console.error("Error deleting quiz:", error);
      alert(error.message);
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h2 className="text-3xl font-bold mb-6">{editingQuizId ? "Edit Quiz" : "Create New Quiz"}</h2>
      {successMessage && (
        <div className="w-full max-w-2xl bg-green-500 text-white text-center p-2 rounded-lg mb-4">{successMessage}</div>
      )}
      <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md space-y-4">
        <input type="text" name="title" placeholder="Quiz Title" value={quizData.title} onChange={handleChange} className="w-full p-2 border rounded-lg" />
        <textarea name="description" placeholder="Description" value={quizData.description} onChange={handleChange} className="w-full p-2 border rounded-lg"></textarea>
        <input type="text" name="courseId" placeholder="Course ID" value={quizData.courseId} onChange={handleChange} className="w-full p-2 border rounded-lg" />
        <input type="text" name="createdBy" placeholder="Instructor ID" value={quizData.createdBy} onChange={handleChange} className="w-full p-2 border rounded-lg" />
        <input type="datetime-local" name="startTime" value={quizData.startTime} onChange={handleChange} className="w-full p-2 border rounded-lg" />
        <input type="datetime-local" name="endTime" value={quizData.endTime} onChange={handleChange} className="w-full p-2 border rounded-lg" />
        <h3 className="text-xl font-semibold mt-4">Add Questions</h3>
        <input type="text" name="text" placeholder="Question Text" value={newQuestion.text} onChange={handleQuestionChange} className="w-full p-2 border rounded-lg" />
        <select name="type" value={newQuestion.type} onChange={handleQuestionChange} className="w-full p-2 border rounded-lg">
          <option value="MCQ">MCQ</option>
          <option value="True/False">True/False</option>
          <option value="Short Answer">Short Answer</option>
        </select>
        {newQuestion.type === "MCQ" && newQuestion.options.map((option, index) => (
          <input key={index} type="text" placeholder={`Option ${index + 1}`} value={option} onChange={(e) => handleOptionChange(index, e.target.value)} className="w-full p-2 border rounded-lg mt-2" />
        ))}
        <input type="text" name="correctAnswer" placeholder="Correct Answer" value={newQuestion.correctAnswer} onChange={handleQuestionChange} className="w-full p-2 border rounded-lg" />
        <input type="number" name="points" placeholder="Points" value={newQuestion.points} onChange={handleQuestionChange} className="w-full p-2 border rounded-lg" />
        <button type="button" onClick={addQuestion} className="w-full bg-yellow-500 text-white p-2 rounded-lg hover:bg-yellow-600">Add Question</button>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600">{editingQuizId ? "Update Quiz" : "Create Quiz"}</button>
      </form>
      <h3 className="text-2xl font-bold mt-8">Upcoming Quizzes</h3>
      {quizzes.map((quiz) => (
        <div key={quiz._id} className="bg-white p-4 rounded-lg shadow-md mt-4 flex justify-between w-full max-w-2xl">
          <div>
            <h4 className="text-lg font-semibold">{quiz.title}</h4>
            <p>{quiz.description}</p>
          </div>
          <div>
            <button onClick={() => handleEdit(quiz)} className="text-blue-500 mr-2">Edit</button>
            <button onClick={() => handleDelete(quiz._id)} className="text-red-500">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Quiz;
