import { useState } from "react"
import Button from "../components/Button"
import UserCard from "../components/UserCard"
import TextArea from "../components/textArea"
import ModuleCard from "../components/ModuleCard"
import InputField from "../components/InputField"
import InputSelect from "../components/InputSelect"
import FormWrapper from "../components/FormWrapper"
import { moduleName,moduleLenght,moduleDescription,firstName } from "../components/formsdasates";
import UserDatail from "../components/UserDetail"
import SimpleCard from "../components/SimpleCard"

const dummyStudents = [
  { name: "Alice Johnson" },
  { name: "Bob Smith" },
  { name: "Charlie Zhang" },
]; 

export default function DevPage() {
 //modifica da fare,passare handlesubmit up,quindi  è nel genitore e poi verra passato down al wrapper
    const handleSubmit = (event) => {
    event.preventDefault()
    console.log(event.target.moduleName.value)
   console.log(event.target.moduleLenght.value)
    console.log(event.target.moduleDescription.value)
    
    //console.log(formIsValid)
    }

   //localStorage.clear()
const provedscriotipn="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vel nulla ac eros gravida feugiat. Ut et ex sed dolor posuere euismod in sit amet arcu. Nulla facilisi. Cras mattis nisl vel accumsan tincidunt. Praesent aliquet purus leo, ac porta tellus blandit ut. Sed non erat vehicula, maximus nisi sed, imperdiet odio. Sed dapibus arcu at vestibulum ultrices. Vestibulum lacinia euismod enim at interdum. Sed gravida, sapien id ultrices pretium, quam nisl finibus tellus, mattis viverra enim magna sit amet massa. Integer nec sapien in augue ultrices aliquam imperdiet a orci. Aenean imperdiet ut ipsum eget rhoncus."
  return (
    <>
      <LessonPage
    moduleName="Mathematics A1"
    lessonDate="2025-06-03"
    startTime="10:00"
    endTime="11:30"
    students={dummyStudents}
    onGoBack={() => alert('Going back to calendar...')}
  />
    </>
  );
}

const LessonPage = ({ moduleName, lessonDate, startTime, endTime, students, onGoBack }) => {

  function handleGoBack(){

  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <SimpleCard   cardLabel="Industrial Software  Developer 2029-2032"   elementID="2"  elementStatus="active"/>
      <SimpleCard  cardLabel="Mario Sgravola Mario.Scravola@gmail.com" elementID="2" elementStatus="inactve" />
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
        <Button styleType="standard" onClick={handleGoBack} > Go back to calendar</Button>
      </div>
    </div>
  );
};

/*
alternative  code
PASSING DOWN THE INPUT FIELDS AS ARRAY
     const password="password";
    const  email="email"
    <FormWrapper   presentFields={[password,email]}   presentFieldsInputs=[passwortInput,emailInput]>
*/
/**
 * <TextArea {...moduleDescription} />
    <InputField />
          <InputField />
          <InputField />
 */