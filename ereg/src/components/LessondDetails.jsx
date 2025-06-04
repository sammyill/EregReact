import React from 'react';

const LessonPage = ({ moduleName, lessonDate, startTime, endTime, students, onGoBack }) => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Lesson Description */}
      <div className="bg-white rounded-2xl shadow p-4 space-y-2 text-center">
        <h2 className=" md:text-2xl text-base font-semibold text-gray-800">{moduleName}</h2>
        <div className="text-gray-600 text-sm md:text-base">
          <p>Date: <span className="font-medium">{lessonDate}</span></p>
          <p>Time: <span className="font-medium">{startTime}</span> - <span className="font-medium">{endTime}</span></p>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-gray-700 font-medium mb-2" htmlFor="lesson-note">Notes</label>
        <textarea
          id="lesson-note"
          rows="4"
          className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Write lesson notes here..."
        ></textarea>
      </div>

      {/* Student List */}
      <div className="bg-white rounded-2xl shadow p-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Students</h3>
        <ul className="space-y-3">
          {students.map((student, index) => (
            <li key={index} className="flex items-center justify-between p-3 border rounded-xl">
              <span className="text-gray-800">{student.name}</span>
              <div className="space-x-2">
                <button className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">Enter</button>
                <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Exit</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Back Button */}
      <div className="flex items-center justify-center">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700"
          onClick={onGoBack}
        >
          Go back to calendar
        </button>
      </div>
    </div>
  );
};

// Dummy data for testing
const dummyStudents = [
  { name: "Alice Johnson" },
  { name: "Bob Smith" },
  { name: "Charlie Zhang" },
];

const App = () => (
  <LessonPage
    moduleName="Mathematics A1"
    lessonDate="2025-06-03"
    startTime="10:00"
    endTime="11:30"
    students={dummyStudents}
    onGoBack={() => alert('Going back to calendar...')}
  />
);

export default App;
